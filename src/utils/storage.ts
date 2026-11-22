import type {
  AuthSession,
  CartItem,
  CheckoutDraft,
  Order,
  StoredAccount,
  ThemeMode,
  UserProfile,
} from '../types/store';

export const STORAGE_KEYS = {
  CART: 'apple_store_cart',
  CHECKOUT: 'apple_store_checkout',
  ORDERS: 'apple_store_orders',
  PROFILE: 'apple_store_profile',
  THEME: 'apple_store_theme',
  NOTIFICATIONS: 'apple_store_notifications',
  CHAT: 'apple_store_chat',
  ACCOUNTS: 'apple_store_accounts',
  AUTH: 'apple_store_auth',
  CATALOG_MIGRATION: 'apple_store_catalog_migration_v1',
} as const;

export const FIXED_SHIPPING_FEE = 52;

export function stripMalaysiaPhonePrefix(raw: string): string {
  let cleaned = raw.replace(/[^\d+\s-]/g, '');
  let prev: string;
  do {
    prev = cleaned;
    cleaned = cleaned.replace(/^[\s-]*(?:\+60|60|0|\+)[\s-]*/, '');
  } while (cleaned !== prev);
  return cleaned.replace(/^[\s-]+/, '');
}

export function formatMalaysiaPhone(raw: string): string {
  const local = stripMalaysiaPhonePrefix(raw).trim();
  return local ? `+60 ${local}` : '';
}

export function normalizePhone(raw: string): string {
  const localDigits = stripMalaysiaPhonePrefix(raw).replace(/\D/g, '');
  if (!localDigits) return '';
  return `60${localDigits}`;
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(`trx-apple-salt::${password}`);
    const digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback deterministic hash if SubtleCrypto is unavailable in non-secure context
  let h = 5381;
  for (let i = 0; i < password.length; i += 1) {
    h = (h * 33) ^ password.charCodeAt(i);
  }
  return `fb-${(h >>> 0).toString(16)}`;
}

export function formatMYR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `RM ${safe.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function safeReadJSON<T>(
  key: string,
  fallback: T,
  validator?: (value: unknown) => value is T
): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed: unknown = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function safeWriteJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or storage restriction errors silently
  }
}

export function isCartArray(val: unknown): val is CartItem[] {
  if (!Array.isArray(val)) return false;
  return val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as CartItem).key === 'string' &&
      typeof (item as CartItem).productId === 'string' &&
      typeof (item as CartItem).variantId === 'string' &&
      typeof (item as CartItem).price === 'number' &&
      typeof (item as CartItem).quantity === 'number' &&
      (item as CartItem).quantity >= 1 &&
      typeof (item as CartItem).stock === 'number'
  );
}

export function isOrderArray(val: unknown): val is Order[] {
  if (!Array.isArray(val)) return false;
  return val.every(
    (order) =>
      typeof order === 'object' &&
      order !== null &&
      typeof (order as Order).id === 'string' &&
      typeof (order as Order).orderNumber === 'string' &&
      Array.isArray((order as Order).items) &&
      typeof (order as Order).total === 'number'
  );
}

export function isUserProfile(val: unknown): val is UserProfile {
  if (typeof val !== 'object' || val === null) return false;
  const p = val as UserProfile;
  return (
    typeof p.name === 'string' &&
    typeof p.email === 'string' &&
    Array.isArray(p.addresses) &&
    Array.isArray(p.wishlist)
  );
}

export function isCheckoutDraft(val: unknown): val is CheckoutDraft {
  if (typeof val !== 'object' || val === null) return false;
  const c = val as CheckoutDraft;
  return (
    typeof c.shippingFee === 'number' &&
    c.shippingMethod === 'standard' &&
    c.paymentStatus === 'undecided'
  );
}

export function isThemeMode(val: unknown): val is ThemeMode {
  return val === 'light' || val === 'dark';
}

export function isStoredAccountArray(val: unknown): val is StoredAccount[] {
  if (!Array.isArray(val)) return false;
  return val.every(
    (acc) =>
      typeof acc === 'object' &&
      acc !== null &&
      typeof (acc as StoredAccount).id === 'string' &&
      typeof (acc as StoredAccount).phone === 'string' &&
      typeof (acc as StoredAccount).normalizedPhone === 'string' &&
      typeof (acc as StoredAccount).passwordHash === 'string'
  );
}

export function isAuthSession(val: unknown): val is AuthSession {
  if (typeof val !== 'object' || val === null) return false;
  const s = val as AuthSession;
  return (
    typeof s.isAuthenticated === 'boolean' &&
    (s.accountId === null || typeof s.accountId === 'string')
  );
}
