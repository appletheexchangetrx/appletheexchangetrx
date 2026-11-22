export type CategoryId =
  | 'iphone'
  | 'mac'
  | 'ipad'
  | 'apple-watch'
  | 'airpods'
  | 'apple-tv-home'
  | 'accessories';

export type ThemeMode = 'light' | 'dark';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  tagline: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  original_price?: number;
  image: string;
}

export interface Product {
  id: string;
  item_group_id: string;
  name: string;
  brand: string;
  category: CategoryId;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  stock: number;
  variants: ProductVariant[];
  is_available: boolean;
  created_at: string;
}

export interface CartItem {
  key: string;
  productId: string;
  variantId: string;
  name: string;
  category: CategoryId;
  variantSummary: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stock: number;
  image: string;
  selected: boolean;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantSummary: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface TrackingStep {
  key: 'order_placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentStatus: 'undecided';
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  trackingTimeline: TrackingStep[];
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'promo' | 'store';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionPath?: string;
  actionLabel?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  addresses: Address[];
  wishlist: string[];
}

export interface CheckoutDraft {
  selectedAddressId: string | null;
  shippingMethod: 'standard';
  shippingFee: number;
  paymentStatus: 'undecided';
  buyNowItem: CartItem | null;
}

export interface ToastItem {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface StoredAccount {
  id: string;
  name: string;
  phone: string;
  normalizedPhone: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  accountId: string | null;
}
