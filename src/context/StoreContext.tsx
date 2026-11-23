import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PROFILE,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
} from '../data/catalog';
import type {
  Address,
  AuthSession,
  CartItem,
  ChatMessage,
  CheckoutDraft,
  NotificationItem,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
  ThemeMode,
  ToastItem,
  UserProfile,
} from '../types/store';
import {
  FIXED_SHIPPING_FEE,
  formatMalaysiaPhone,
  formatMYR,
  isAuthSession,
  isCartArray,
  isCheckoutDraft,
  isOrderArray,
  isThemeMode,
  isUserProfile,
  normalizePhone,
  safeReadJSON,
  safeWriteJSON,
  STORAGE_KEYS,
} from '../utils/storage';
import { fetchProducts } from '../services/productService';
import { checkPhoneExists as checkRegisteredPhone, loginUser, registerUser } from '../services/authService';
import { getUserByPhone, updateUser, type UserRecord } from '../services/userService';

interface StoreContextValue {
  // Navigation
  pathname: string;
  searchQuery: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  goBack: (fallback?: string) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Catalog
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<Product[]>;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  cartCount: number;
  selectedCartItems: CartItem[];
  cartSubtotal: number;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  updateCartQuantity: (key: string, quantity: number) => void;
  toggleCartItemSelect: (key: string) => void;
  toggleSelectAllCart: (selected: boolean) => void;
  removeCartItem: (key: string) => void;
  removeSelectedCartItems: () => void;
  buyNow: (product: Product, variant: ProductVariant, quantity?: number) => void;

  // Checkout & Orders
  checkout: CheckoutDraft;
  setSelectedAddressId: (id: string) => void;
  clearBuyNow: () => void;
  orders: Order[];
  lastOrderId: string | null;
  placeOrder: (freshProducts?: Product[]) => { ok: true; order: Order } | { ok: false; error: string };
  cancelOrder: (orderId: string) => void;
  buyAgainOrder: (order: Order) => void;

  // Auth & Profile & Addresses & Wishlist
  isAuthenticated: boolean;
  checkPhoneExists: (phone: string) => Promise<boolean>;
  registerWithPhone: (params: {
    name: string;
    phone: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  loginWithPhone: (params: {
    phone: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  logoutAccount: () => void;
  profile: UserProfile;
  updateProfileInfo: (patch: Partial<Pick<UserProfile, 'name'>>) => Promise<void>;
  saveAddress: (address: Omit<Address, 'id'> & { id?: string }) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  resetSessionData: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Live Chat
  chatMessages: ChatMessage[];
  isSpecialistTyping: boolean;
  sendChatMessage: (text: string) => void;
  clearChatMessages: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastItem['variant']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AX';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function mapUserProfile(user: UserRecord): UserProfile {
  return {
    name: user.full_name,
    email: '',
    phone: formatMalaysiaPhone(user.phone),
    avatarInitials: computeInitials(user.full_name),
    addresses: Array.isArray(user.user_addresses) ? user.user_addresses : [],
    wishlist: Array.isArray(user.user_wishlist) ? user.user_wishlist : [],
  };
}

function generateSpecialistReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('hour') || q.includes('open') || q.includes('address') || q.includes('location') || q.includes('where')) {
    return 'Apple The Exchange TRX is located at Lot C.01.0, Plaza The Exchange TRX, Kuala Lumpur. We are open daily from 10:00 AM to 10:00 PM.';
  }
  if (q.includes('ship') || q.includes('deliver') || q.includes('fee') || q.includes('52')) {
    return 'All online orders ship via insured nationwide courier for a flat RM 52.00 delivery fee across Malaysia. Dispatch typically takes 1–2 business days.';
  }
  if (q.includes('pay') || q.includes('card') || q.includes('fpx') || q.includes('installment')) {
    return 'Checkout payment method selection is currently pending store configuration (undecided). You can still review your bag, verify delivery details, and submit an order reservation.';
  }
  if (q.includes('iphone') || q.includes('18 pro')) {
    return 'You can browse the current iPhone models, available configurations, and live stock in the Products catalog.';
  }
  if (q.includes('mac') || q.includes('macbook') || q.includes('ipad')) {
    return 'Browse the current Mac and iPad catalog to see available models, configurations, and product details.';
  }
  if (q.includes('order') || q.includes('track') || q.includes('cancel')) {
    return 'You can view live tracking steps, copy your order reference, or manage eligible orders anytime from Profile > My Orders.';
  }
  return 'Thank you for messaging Apple The Exchange TRX. A Specialist is ready to assist with Apple product specs, MYR pricing, or existing orders—feel free to ask anything specific.';
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationState, setLocationState] = useState<{ pathname: string; search: string }>(() => ({
    pathname: typeof window !== 'undefined' ? window.location.pathname || '/' : '/',
    search: typeof window !== 'undefined' ? window.location.search || '' : '',
  }));

  const [theme, setThemeState] = useState<ThemeMode>(() =>
    safeReadJSON<ThemeMode>(STORAGE_KEYS.THEME, 'light', isThemeMode)
  );

  // Product catalog migration: legacy cart snapshots are intentionally discarded.
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const migrated = window.localStorage.getItem(STORAGE_KEYS.CATALOG_MIGRATION) === 'complete';
        if (!migrated) {
          window.localStorage.removeItem(STORAGE_KEYS.CART);
          window.localStorage.removeItem(STORAGE_KEYS.CHECKOUT);
          window.localStorage.setItem(STORAGE_KEYS.CATALOG_MIGRATION, 'complete');
          return [];
        }
      } catch {
        // Continue with the validated storage read when browser storage is unavailable.
      }
    }
    return safeReadJSON<CartItem[]>(STORAGE_KEYS.CART, [], isCartArray);
  });

  const [profile, setProfile] = useState<UserProfile>(() =>
    safeReadJSON<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE, isUserProfile)
  );

  const [checkout, setCheckout] = useState<CheckoutDraft>(() =>
    safeReadJSON<CheckoutDraft>(
      STORAGE_KEYS.CHECKOUT,
      {
        selectedAddressId: DEFAULT_PROFILE.addresses[0]?.id ?? null,
        shippingMethod: 'standard',
        shippingFee: FIXED_SHIPPING_FEE,
        paymentStatus: 'undecided',
        buyNowItem: null,
      },
      isCheckoutDraft
    )
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    safeReadJSON<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS, isOrderArray)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeReadJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS, Array.isArray)
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    safeReadJSON<ChatMessage[]>(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES, Array.isArray)
  );

  const [authSession, setAuthSession] = useState<AuthSession>(() =>
    safeReadJSON<AuthSession>(
      STORAGE_KEYS.AUTH,
      { isAuthenticated: false, phone: null, password: null },
      isAuthSession
    )
  );

  const [isSpecialistTyping, setIsSpecialistTyping] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const refreshProducts = useCallback(async (): Promise<Product[]> => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const nextProducts = await fetchProducts();
      setProducts(nextProducts);
      const validProductIds = new Set(nextProducts.map((product) => product.id));
      setNotifications((prev) => prev.map((notification) => {
        const actionPath = notification.actionPath || '';
        if (!actionPath.startsWith('/product/')) return notification;
        const linkedId = decodeURIComponent(actionPath.slice('/product/'.length));
        return validProductIds.has(linkedId)
          ? notification
          : { ...notification, actionPath: '/products', actionLabel: 'Browse Products' };
      }));
      setProfile((prev) => ({
        ...prev,
        wishlist: prev.wishlist.filter((productId) => validProductIds.has(productId)),
      }));
      return nextProducts;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load products.';
      setProductsError(message);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProducts().catch(() => undefined);
  }, [refreshProducts]);

  // Sync popstate for browser back/forward
  useEffect(() => {
    const onPopState = () => {
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync dark class & theme storage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    safeWriteJSON(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist states
  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.CHECKOUT, checkout);
  }, [checkout]);

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.CHAT, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    if (authSession.isAuthenticated && authSession.phone && authSession.password) {
      safeWriteJSON(STORAGE_KEYS.AUTH, authSession);
    } else if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [authSession]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastItem['variant'] = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, variant, message }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3000);
    },
    [dismissToast]
  );

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const [pathPart, queryPart] = to.split('?');
    const nextPath = pathPart || '/';
    const nextSearch = queryPart ? `?${queryPart}` : '';
    const full = `${nextPath}${nextSearch}`;

    if (options?.replace) {
      window.history.replaceState({}, '', full);
    } else {
      window.history.pushState({}, '', full);
    }
    setLocationState({ pathname: nextPath, search: nextSearch });
  }, []);

  const goBack = useCallback(
    (fallback = '/') => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigate(fallback, { replace: true });
      }
    },
    [navigate]
  );

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const selectedCartItems = useMemo(
    () => cart.filter((item) => item.selected),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedCartItems]
  );

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1): boolean => {
      const usedStock = cart
        .filter((item) => item.productId === product.id && item.variantId === variant.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      const remainingStock = Math.max(0, variant.stock - usedStock);
      if (!product.is_available || remainingStock <= 0) {
        showToast('This product is currently out of stock or its stock is already in your bag.', 'error');
        return false;
      }

      const safeAdd = Math.min(Math.max(1, quantity), remainingStock);
      const clamped = safeAdd < quantity;
      const key = `${product.id}::${variant.id}`;
      const existing = cart.find((item) => item.key === key);
      const newItem: CartItem = {
        key,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        category: product.category,
        variantSummary: `${variant.color} · ${variant.size}`,
        price: variant.price,
        originalPrice: variant.original_price,
        quantity: (existing?.quantity || 0) + safeAdd,
        stock: variant.stock,
        image: variant.image || product.images[0] || '',
        selected: true,
      };

      setCart((prev) =>
        existing
          ? prev.map((item) => item.key === key ? newItem : item)
          : [newItem, ...prev]
      );

      showToast(
        clamped
          ? `Added to bag (capped at ${variant.stock} units for this variant).`
          : `${product.name} added to bag.`,
        clamped ? 'warning' : 'success'
      );
      return true;
    },
    [cart, showToast]
  );

  const updateCartQuantity = useCallback(
    (key: string, quantity: number) => {
      const current = cart.find((item) => item.key === key);
      if (!current) return;
      const otherVariantQuantity = cart
        .filter((item) => item.productId === current.productId && item.variantId === current.variantId && item.key !== key)
        .reduce((sum, item) => sum + item.quantity, 0);
      const maxForLine = Math.max(0, current.stock - otherVariantQuantity);
      if (maxForLine < 1) {
        setCart((prev) => prev.filter((item) => item.key !== key));
        showToast('This product no longer has available stock for this cart line.', 'warning');
        return;
      }
      const nextQuantity = Math.min(Math.max(1, quantity), maxForLine);
      if (nextQuantity < quantity) {
        showToast(`Only ${maxForLine} total units remain for this product.`, 'warning');
      }
      setCart((prev) =>
        prev.map((item) => item.key === key ? { ...item, quantity: nextQuantity } : item)
      );
    },
    [cart, showToast]
  );

  const toggleCartItemSelect = useCallback((key: string) => {
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, selected: !item.selected } : item))
    );
  }, []);

  const toggleSelectAllCart = useCallback((selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  }, []);

  const removeCartItem = useCallback(
    (key: string) => {
      setCart((prev) => prev.filter((item) => item.key !== key));
      showToast('Item removed from bag.', 'info');
    },
    [showToast]
  );

  const removeSelectedCartItems = useCallback(() => {
    setCart((prev) => prev.filter((item) => !item.selected));
    showToast('Selected items removed.', 'info');
  }, [showToast]);

  const buyNow = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      const maxStock = Math.max(0, variant.stock);
      if (!product.is_available || maxStock <= 0) {
        showToast('This configuration is currently out of stock.', 'error');
        return;
      }
      const safeQty = Math.min(maxStock, Math.max(1, quantity));
      const directItem: CartItem = {
        key: `${product.id}::${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        category: product.category,
        variantSummary: `${variant.color} · ${variant.size}`,
        price: variant.price,
        originalPrice: variant.original_price,
        quantity: safeQty,
        stock: variant.stock,
        image: variant.image || product.images[0] || '',
        selected: true,
      };
      setCheckout((prev) => ({
        ...prev,
        shippingFee: FIXED_SHIPPING_FEE,
        shippingMethod: 'standard',
        paymentStatus: 'undecided',
        buyNowItem: directItem,
      }));
      navigate('/checkout');
    },
    [navigate, showToast]
  );

  const setSelectedAddressId = useCallback((id: string) => {
    setCheckout((prev) => ({ ...prev, selectedAddressId: id }));
  }, []);

  const clearBuyNow = useCallback(() => {
    setCheckout((prev) => ({ ...prev, buyNowItem: null }));
  }, []);

  const placeOrder = useCallback((freshProducts?: Product[]): { ok: true; order: Order } | { ok: false; error: string } => {
    const sourceItems = checkout.buyNowItem
      ? [checkout.buyNowItem]
      : cart.filter((item) => item.selected);

    if (sourceItems.length === 0) {
      return { ok: false, error: 'Your checkout selection is empty. Select at least one item.' };
    }

    const liveCatalog = freshProducts ?? products;
    const itemsToOrder: CartItem[] = [];
    for (const item of sourceItems) {
      const liveProduct = liveCatalog.find((product) => product.id === item.productId);
      const liveVariant = liveProduct?.variants.find((variant) => variant.id === item.variantId);
      if (!liveProduct || !liveVariant) {
        return { ok: false, error: 'A product or variant in your bag is no longer available. Please review your bag.' };
      }
      if (!liveProduct.is_available || liveVariant.stock <= 0) {
        return { ok: false, error: `${liveProduct.name} (${liveVariant.color} · ${liveVariant.size}) is currently unavailable.` };
      }
      if (item.quantity > liveVariant.stock) {
        return { ok: false, error: `${liveProduct.name} (${liveVariant.color} · ${liveVariant.size}) has only ${liveVariant.stock} units available.` };
      }
      itemsToOrder.push({
        ...item,
        name: liveProduct.name,
        category: liveProduct.category,
        variantSummary: `${liveVariant.color} · ${liveVariant.size}`,
        price: liveVariant.price,
        originalPrice: liveVariant.original_price,
        stock: liveVariant.stock,
        image: liveVariant.image || liveProduct.images[0] || '',
      });
    }

    const quantitiesByVariant = new Map<string, number>();
    itemsToOrder.forEach((item) => {
      const key = `${item.productId}::${item.variantId}`;
      quantitiesByVariant.set(key, (quantitiesByVariant.get(key) || 0) + item.quantity);
    });
    for (const [variantKey, quantity] of quantitiesByVariant) {
      const [productId, variantId] = variantKey.split('::');
      const product = liveCatalog.find((item) => item.id === productId);
      const variant = product?.variants.find((item) => item.id === variantId);
      if (!product || !variant || quantity > variant.stock) {
        return {
          ok: false,
          error: `${product?.name || 'A product'} has only ${variant?.stock ?? 0} units available for this variant. Please update your bag.`,
        };
      }
    }

    const address =
      profile.addresses.find((a) => a.id === checkout.selectedAddressId) ||
      profile.addresses.find((a) => a.isDefault) ||
      profile.addresses[0];

    if (!address) {
      return { ok: false, error: 'Please add a shipping address before placing your order.' };
    }

    const subtotal = itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = FIXED_SHIPPING_FEE;
    const discount = 0;
    const total = subtotal + shippingFee - discount;
    const now = new Date().toISOString();
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-trx-${Date.now()}`;
    const orderNumber = `TRX-2026-${suffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      paymentStatus: 'undecided',
      shippingAddress: address,
      items: itemsToOrder.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        variantSummary: item.variantSummary,
        unitPrice: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shippingFee,
      discount,
      total,
      trackingTimeline: [
        {
          key: 'order_placed',
          label: 'Order Placed',
          description: 'Received by Apple The Exchange TRX',
          timestamp: now,
          completed: true,
          current: true,
        },
        {
          key: 'processing',
          label: 'Processing',
          description: 'Awaiting payment confirmation & fulfilment prep',
          timestamp: null,
          completed: false,
          current: false,
        },
        {
          key: 'shipped',
          label: 'Shipped',
          description: 'Handed over to insured courier partner',
          timestamp: null,
          completed: false,
          current: false,
        },
        {
          key: 'out_for_delivery',
          label: 'Out for Delivery',
          description: 'Courier en route to destination address',
          timestamp: null,
          completed: false,
          current: false,
        },
        {
          key: 'delivered',
          label: 'Delivered',
          description: 'Signed and received by recipient',
          timestamp: null,
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderId(newOrder.id);

    if (checkout.buyNowItem) {
      setCheckout((prev) => ({ ...prev, buyNowItem: null }));
    } else {
      const purchasedKeys = new Set(itemsToOrder.map((i) => i.key));
      setCart((prev) => prev.filter((item) => !purchasedKeys.has(item.key)));
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'order',
        title: `Order ${orderNumber} Placed`,
        message: `Total ${formatMYR(total)} including RM 52.00 delivery fee.`,
        timestamp: now,
        read: false,
        actionPath: `/orders/${orderId}`,
        actionLabel: 'View Order',
      },
      ...prev,
    ]);

    showToast(`Order ${orderNumber} placed.`, 'success');
    return { ok: true, order: newOrder };
  }, [cart, checkout, profile.addresses, products, showToast]);

  const cancelOrder = useCallback(
    (orderId: string) => {
      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            status: 'cancelled' as OrderStatus,
            updatedAt: now,
            trackingTimeline: order.trackingTimeline.map((step) => ({
              ...step,
              current: false,
            })),
          };
        })
      );
      showToast('Order cancelled.', 'info');
    },
    [showToast]
  );

  const buyAgainOrder = useCallback(
    (order: Order) => {
      let addedCount = 0;
      order.items.forEach((orderItem) => {
        const product = products.find((p) => p.id === orderItem.productId);
        if (!product) return;
        const variant = product.variants.find((v) => v.id === orderItem.variantId);
        if (!variant) return;
        const ok = addToCart(product, variant, orderItem.quantity);
        if (ok) addedCount += 1;
      });
      if (addedCount > 0) {
        navigate('/cart');
      }
    },
    [addToCart, navigate, products]
  );

  const checkPhoneExists = useCallback(
    async (phone: string): Promise<boolean> => {
      const normalized = normalizePhone(phone.trim());
      if (normalized.length < 9) return false;
      return checkRegisteredPhone(normalized);
    },
    []
  );

  const registerWithPhone = useCallback(
    async ({ name, phone, password }: {
      name: string;
      phone: string;
      password: string;
    }): Promise<{ ok: true } | { ok: false; error: string }> => {
      const trimmedName = name.trim();
      const normalized = normalizePhone(phone.trim());

      if (!trimmedName) return { ok: false, error: 'Please enter your full name.' };
      if (normalized.length < 9) return { ok: false, error: 'Please enter a valid phone number.' };
      if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

      try {
        const user = await registerUser({ phone: normalized, fullName: trimmedName, password });
        setAuthSession({ isAuthenticated: true, phone: normalized, password });
        setProfile(mapUserProfile(user));
        showToast(`Welcome, ${user.full_name}.`, 'success');
        return { ok: true };
      } catch (error) {
        const message = error instanceof Error && error.message.toLowerCase().includes('duplicate')
          ? 'This phone number is already registered. Please sign in instead.'
          : error instanceof Error ? error.message : 'Unable to create your account.';
        return { ok: false, error: message };
      }
    },
    [showToast]
  );

  const loginWithPhone = useCallback(
    async ({ phone, password }: {
      phone: string;
      password: string;
    }): Promise<{ ok: true } | { ok: false; error: string }> => {
      const normalized = normalizePhone(phone.trim());
      if (normalized.length < 9) return { ok: false, error: 'Please enter a valid phone number.' };
      if (!password) return { ok: false, error: 'Please enter your password.' };

      try {
        const user = await loginUser(normalized, password);
        if (!user) return { ok: false, error: 'Incorrect phone number or password.' };
        setAuthSession({ isAuthenticated: true, phone: normalized, password });
        setProfile(mapUserProfile(user));
        showToast(`Signed in as ${user.full_name}.`, 'success');
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
        };
      }
    },
    [showToast]
  );

  useEffect(() => {
    let cancelled = false;
    if (!authSession.isAuthenticated || !authSession.phone || !authSession.password) return;
    void getUserByPhone(authSession.phone)
      .then((user) => {
        if (cancelled) return;
        if (!user || !user.is_active || user.password !== authSession.password) {
          setAuthSession({ isAuthenticated: false, phone: null, password: null });
          return;
        }
        setProfile(mapUserProfile(user));
      })
      .catch(() => {
        if (!cancelled) setAuthSession({ isAuthenticated: false, phone: null, password: null });
      });
    return () => { cancelled = true; };
  }, [authSession.isAuthenticated, authSession.phone, authSession.password]);

  const logoutAccount = useCallback(() => {
    setAuthSession({ isAuthenticated: false, phone: null, password: null });
    setProfile(DEFAULT_PROFILE);
    showToast('Signed out.', 'info');
  }, [showToast]);

  const updateProfileInfo = useCallback(
    async (patch: Partial<Pick<UserProfile, 'name'>>): Promise<void> => {
      const nextName = patch.name?.trim();
      if (!nextName || !authSession.phone) return;
      try {
        const user = await updateUser(authSession.phone, { full_name: nextName });
        setProfile(mapUserProfile(user));
        showToast('Account details updated.', 'success');
      } catch {
        showToast('Unable to update account details.', 'error');
      }
    },
    [authSession.phone, showToast]
  );

  const saveAddress = useCallback(
    async (addressInput: Omit<Address, 'id'> & { id?: string }): Promise<Address> => {
      const id = addressInput.id || `addr-${Date.now()}`;
      const newAddress: Address = {
        ...addressInput,
        phone: formatMalaysiaPhone(addressInput.phone) || addressInput.phone,
        id,
      };
      let nextAddresses = addressInput.id
        ? profile.addresses.map((address) => address.id === id ? newAddress : address)
        : [...profile.addresses, newAddress];
      if (newAddress.isDefault || nextAddresses.length === 1) {
        nextAddresses = nextAddresses.map((address) => ({ ...address, isDefault: address.id === id }));
      }

      try {
        if (authSession.phone) {
          const user = await updateUser(authSession.phone, { user_addresses: nextAddresses });
          setProfile(mapUserProfile(user));
        } else {
          setProfile((previous) => ({ ...previous, addresses: nextAddresses }));
        }
        setCheckout((previous) => ({ ...previous, selectedAddressId: id }));
        showToast('Shipping address saved.', 'success');
        return newAddress;
      } catch {
        showToast('Unable to save shipping address.', 'error');
        throw new Error('Unable to save shipping address.');
      }
    },
    [authSession.phone, profile.addresses, showToast]
  );

  const deleteAddress = useCallback(
    async (id: string): Promise<void> => {
      let remaining = profile.addresses.filter((address) => address.id !== id);
      if (remaining.length > 0 && !remaining.some((address) => address.isDefault)) {
        remaining = remaining.map((address, index) => index === 0 ? { ...address, isDefault: true } : address);
      }
      try {
        if (authSession.phone) {
          const user = await updateUser(authSession.phone, { user_addresses: remaining });
          setProfile(mapUserProfile(user));
        } else {
          setProfile((previous) => ({ ...previous, addresses: remaining }));
        }
        setCheckout((previous) => ({
          ...previous,
          selectedAddressId: previous.selectedAddressId === id ? null : previous.selectedAddressId,
        }));
        showToast('Address removed.', 'info');
      } catch {
        showToast('Unable to remove address.', 'error');
      }
    },
    [authSession.phone, profile.addresses, showToast]
  );

  const setDefaultAddress = useCallback(
    async (id: string): Promise<void> => {
      const nextAddresses = profile.addresses.map((address) => ({ ...address, isDefault: address.id === id }));
      try {
        if (authSession.phone) {
          const user = await updateUser(authSession.phone, { user_addresses: nextAddresses });
          setProfile(mapUserProfile(user));
        } else {
          setProfile((previous) => ({ ...previous, addresses: nextAddresses }));
        }
        setCheckout((previous) => ({ ...previous, selectedAddressId: id }));
        showToast('Default address updated.', 'success');
      } catch {
        showToast('Unable to update default address.', 'error');
      }
    },
    [authSession.phone, profile.addresses, showToast]
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<void> => {
      const exists = profile.wishlist.includes(productId);
      const nextWishlist = exists
        ? profile.wishlist.filter((id) => id !== productId)
        : [...profile.wishlist, productId];
      try {
        if (authSession.phone) {
          const user = await updateUser(authSession.phone, { user_wishlist: nextWishlist });
          setProfile(mapUserProfile(user));
        } else {
          setProfile((previous) => ({ ...previous, wishlist: nextWishlist }));
        }
        showToast(exists ? 'Removed from favorites.' : 'Saved to favorites.', 'info');
      } catch {
        showToast('Unable to update favorites.', 'error');
      }
    },
    [authSession.phone, profile.wishlist, showToast]
  );

  const resetSessionData = useCallback(() => {
    setAuthSession({ isAuthenticated: false, phone: null, password: null });
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setProfile(DEFAULT_PROFILE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setCheckout({
      selectedAddressId: DEFAULT_PROFILE.addresses[0]?.id ?? null,
      shippingMethod: 'standard',
      shippingFee: FIXED_SHIPPING_FEE,
      paymentStatus: 'undecided',
      buyNowItem: null,
    });
    showToast('Signed out and store session reset.', 'info');
  }, [showToast]);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'success');
  }, [showToast]);

  const sendChatMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsSpecialistTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'specialist',
        text: generateSpecialistReply(trimmed),
        timestamp: new Date().toISOString(),
        status: 'read',
      };
      setIsSpecialistTyping(false);
      setChatMessages((prev) => [...prev, reply]);
    }, 650);
  }, []);

  const clearChatMessages = useCallback(() => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
    showToast('Conversation cleared.', 'info');
  }, [showToast]);

  const value = useMemo<StoreContextValue>(
    () => ({
      pathname: locationState.pathname,
      searchQuery: locationState.search,
      navigate,
      goBack,
      theme,
      setTheme,
      toggleTheme,
      products,
      productsLoading,
      productsError,
      refreshProducts,
      getProductById,
      cart,
      cartCount,
      selectedCartItems,
      cartSubtotal,
      addToCart,
      updateCartQuantity,
      toggleCartItemSelect,
      toggleSelectAllCart,
      removeCartItem,
      removeSelectedCartItems,
      buyNow,
      checkout,
      setSelectedAddressId,
      clearBuyNow,
      orders,
      lastOrderId,
      placeOrder,
      cancelOrder,
      buyAgainOrder,
      isAuthenticated: authSession.isAuthenticated && Boolean(authSession.phone && authSession.password),
      checkPhoneExists,
      registerWithPhone,
      loginWithPhone,
      logoutAccount,
      profile,
      updateProfileInfo,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      toggleWishlist,
      resetSessionData,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      chatMessages,
      isSpecialistTyping,
      sendChatMessage,
      clearChatMessages,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      locationState,
      navigate,
      goBack,
      theme,
      setTheme,
      toggleTheme,
      getProductById,
      products,
      productsLoading,
      productsError,
      refreshProducts,
      cart,
      cartCount,
      selectedCartItems,
      cartSubtotal,
      addToCart,
      updateCartQuantity,
      toggleCartItemSelect,
      toggleSelectAllCart,
      removeCartItem,
      removeSelectedCartItems,
      buyNow,
      checkout,
      setSelectedAddressId,
      clearBuyNow,
      orders,
      lastOrderId,
      placeOrder,
      cancelOrder,
      buyAgainOrder,
      authSession.isAuthenticated,
      checkPhoneExists,
      registerWithPhone,
      loginWithPhone,
      logoutAccount,
      profile,
      updateProfileInfo,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      toggleWishlist,
      resetSessionData,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      chatMessages,
      isSpecialistTyping,
      sendChatMessage,
      clearChatMessages,
      toasts,
      showToast,
      dismissToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
