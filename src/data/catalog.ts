import type {
  Category,
  ChatMessage,
  NotificationItem,
  Order,
  UserProfile,
} from '../types/store';

export const STORE_BRAND = {
  name: 'Apple The Exchange TRX',
  shortName: 'Apple TRX',
  address: 'Lot C.01.0, Plaza The Exchange TRX, Persiaran TRX, 55188 Kuala Lumpur',
  hours: 'Daily, 10:00 AM – 10:00 PM',
  phone: '+60 3-2181 8000',
};

export const IMG_HERO_IPHONE = '/src/assets/images/hero_iphone_trx_1795310621867.jpg';
export const IMG_IPHONE_PRO = '/src/assets/images/product_iphone_pro_1795310621429.jpg';
export const IMG_MACBOOK_PRO = '/src/assets/images/product_macbook_pro_1795310622063.jpg';
export const IMG_IPAD_PRO = '/src/assets/images/product_ipad_pro_1795310621252.jpg';
export const IMG_APPLE_WATCH = '/src/assets/images/product_apple_watch_1795310622308.jpg';
export const IMG_AIRPODS_PRO = '/src/assets/images/product_airpods_pro_1795310620622.jpg';
export const IMG_HOMEPOD_TV = '/src/assets/images/product_homepod_tv_1795310620865.jpg';
export const IMG_ACCESSORIES = '/src/assets/images/product_accessories_1795310621777.jpg';
export const IMG_PROMO_TRX = '/src/assets/images/promo_trx_ecosystem_1795310621999.jpg';

export const CATEGORIES: Category[] = [
  { id: 'iphone', name: 'iPhone', icon: 'smartphone', tagline: 'Pro performance & camera' },
  { id: 'mac', name: 'Mac', icon: 'laptop', tagline: 'Apple silicon power' },
  { id: 'ipad', name: 'iPad', icon: 'tablet', tagline: 'Touch, draw & create' },
  { id: 'apple-watch', name: 'Apple Watch', icon: 'watch', tagline: 'Health & endurance' },
  { id: 'airpods', name: 'AirPods', icon: 'headphones', tagline: 'Spatial audio clarity' },
  { id: 'apple-tv-home', name: 'Apple TV & Home', icon: 'tv', tagline: 'Smart living room' },
  { id: 'accessories', name: 'Accessories', icon: 'cable', tagline: 'MagSafe & essentials' },
];

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetPath: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-iphone-18-pro',
    eyebrow: 'New at The Exchange TRX',
    title: 'Discover the Apple lineup',
    description: 'Explore the latest Apple products available at Apple The Exchange TRX.',
    ctaLabel: 'Explore Products',
    targetPath: '/products',
    image: IMG_PROMO_TRX,
  },
  {
    id: 'slide-trx-pavilion',
    eyebrow: 'Flagship Experience · Kuala Lumpur',
    title: 'Apple The Exchange TRX',
    description: 'Explore the complete Apple lineup with insured nationwide courier delivery across Malaysia.',
    ctaLabel: 'Browse Catalog',
    targetPath: '/products',
    image: IMG_PROMO_TRX,
  },
];

export interface PromotionItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetPath: string;
  image: string;
}

export const PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-trx-store',
    eyebrow: 'Plaza The Exchange TRX',
    title: 'Specialist Advice & Personal Setup',
    description: 'Chat live with our Kuala Lumpur store team for sizing, specs, and configuration guidance.',
    ctaLabel: 'Start Live Chat',
    targetPath: '/livechat',
    image: IMG_PROMO_TRX,
  },
  {
    id: 'promo-mac-studio',
    eyebrow: 'Apple Silicon Lineup',
    title: 'Explore Apple Products',
    description: 'Discover Apple devices and accessories available from our store.',
    ctaLabel: 'Browse Products',
    targetPath: '/products',
    image: IMG_MACBOOK_PRO,
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Amirul Hakim',
  email: 'appletheexchangetrx@gmail.com',
  phone: '+60 12-345 6789',
  avatarInitials: 'AH',
  wishlist: [],
  addresses: [
    {
      id: 'addr-trx-1',
      label: 'Home',
      recipientName: 'Amirul Hakim',
      phone: '+60 12-345 6789',
      line1: 'Unit 28-05, Residences at Tun Razak Exchange',
      line2: 'Persiaran TRX',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
      postcode: '55188',
      isDefault: true,
    },
    {
      id: 'addr-trx-2',
      label: 'Office',
      recipientName: 'Amirul Hakim',
      phone: '+60 12-345 6789',
      line1: 'Level 19, Menara Exchange 106',
      line2: 'Lingkaran TRX',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
      postcode: '55188',
      isDefault: false,
    },
  ],
};

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Order TRX-2026-8412 is Processing',
    message: 'Your AirPods Pro 3 and MagSafe Charger are being prepared at Apple The Exchange TRX.',
    timestamp: '2026-11-19T16:40:00+08:00',
    read: false,
    actionPath: '/orders/ord-trx-1001',
    actionLabel: 'Track Order',
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: 'Explore iPhone',
    message: 'Browse the iPhone models currently available at Apple The Exchange TRX.',
    timestamp: '2026-11-18T09:00:00+08:00',
    read: false,
    actionPath: '/products?category=iphone',
    actionLabel: 'View iPhone Products',
  },
  {
    id: 'notif-3',
    type: 'store',
    title: 'Welcome to Apple The Exchange TRX',
    message: 'Store hours: Daily 10:00 AM – 10:00 PM at Plaza The Exchange TRX, Kuala Lumpur.',
    timestamp: '2026-11-15T10:00:00+08:00',
    read: true,
    actionPath: '/products',
    actionLabel: 'Browse Catalog',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-welcome-1',
    sender: 'specialist',
    text: 'Selamat datang to Apple The Exchange TRX. How can a Specialist help you with iPhone, Mac, iPad, or your order today?',
    timestamp: '2026-11-21T10:00:00+08:00',
    status: 'read',
  },
];
