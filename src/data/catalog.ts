import type {
  Category,
  ChatMessage,
  NotificationItem,
  Order,
  Product,
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
    title: 'iPhone 18 Pro Max',
    description: 'Aerospace-grade titanium, A20 Pro chip, and pro camera control in four curated finishes.',
    ctaLabel: 'Shop iPhone 18 Pro Max',
    targetPath: '/product/apple-iphone-18-pro-max',
    image: IMG_HERO_IPHONE,
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
    title: 'MacBook Pro & iPad Pro',
    description: 'Built for creative workflows with Liquid Retina XDR and all-day battery life.',
    ctaLabel: 'Explore Mac',
    targetPath: '/products?category=mac',
    image: IMG_MACBOOK_PRO,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'apple-iphone-18-pro-max',
    item_group_id: 'APPLE-IPHONE-18-PRO-MAX',
    name: 'Apple iPhone 18 Pro Max',
    brand: 'Apple',
    category: 'iphone',
    description:
      'Flagship 6.9-inch Super Retina XDR display with ProMotion, forged titanium enclosure, A20 Pro silicon, and a 48MP Fusion triple-camera system designed for studio-grade photography.',
    price: 5999,
    images: [IMG_IPHONE_PRO, IMG_HERO_IPHONE],
    stock: 50,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Display', value: '6.9-inch Super Retina XDR OLED, 120Hz ProMotion' },
      { label: 'Chip', value: 'A20 Pro with 6-core GPU & Neural Engine' },
      { label: 'Camera', value: '48MP Fusion Main + 48MP Ultra Wide + 5x Telephoto' },
      { label: 'Connectivity', value: '5G, Wi-Fi 7, USB-C (USB 3), MagSafe' },
      { label: 'Water Resistance', value: 'IP68 (6 metres up to 30 minutes)' },
    ],
    variants: [
      { id: '5bb40d3f-ba11-493e-a2ea-668113723c9b', size: '256GB', color: 'Black', colorHex: '#1D1D1F', price: 5999, stock: 18, image: IMG_IPHONE_PRO },
      { id: 'f1b702ae-7209-485a-a780-6aed04470cb9', size: '512GB', color: 'Black', colorHex: '#1D1D1F', price: 6999, stock: 12, image: IMG_IPHONE_PRO },
      { id: 'd3ec0d14-2883-4ce5-94a8-a6c5f50fde17', size: '1TB', color: 'Black', colorHex: '#1D1D1F', price: 8999, stock: 8, image: IMG_IPHONE_PRO },
      { id: '47bf6f71-8c5b-4bd6-b3e5-5bb853f578c5', size: '2TB', color: 'Black', colorHex: '#1D1D1F', price: 11999, stock: 4, image: IMG_IPHONE_PRO },
      { id: '765602a5-356b-4dac-b85a-1acb1e89f7ac', size: '256GB', color: 'Silver', colorHex: '#D2D2D7', price: 5999, stock: 16, image: IMG_HERO_IPHONE },
      { id: '8cc9b021-77de-455f-9bcf-6b7afd62c58e', size: '512GB', color: 'Silver', colorHex: '#D2D2D7', price: 6999, stock: 10, image: IMG_HERO_IPHONE },
      { id: '5f8d3cf4-092f-4cd2-8da3-2e90c2f0f911', size: '1TB', color: 'Silver', colorHex: '#D2D2D7', price: 8999, stock: 6, image: IMG_HERO_IPHONE },
      { id: '46b6e5c0-0f6a-46e8-ac7d-f71246137da1', size: '2TB', color: 'Silver', colorHex: '#D2D2D7', price: 11999, stock: 3, image: IMG_HERO_IPHONE },
      { id: '8308ff1f-6722-48fe-baf9-04d51be4ce8b', size: '256GB', color: 'Glacier', colorHex: '#BFD4E2', price: 5999, stock: 14, image: IMG_HERO_IPHONE },
      { id: '635b5139-b7a5-4d9f-bfba-3ed0455afc07', size: '512GB', color: 'Glacier', colorHex: '#BFD4E2', price: 6999, stock: 9, image: IMG_HERO_IPHONE },
      { id: '87304ab2-23da-486e-a5a0-7d728bb6299a', size: '256GB', color: 'Burgundy', colorHex: '#632934', price: 5999, stock: 11, image: IMG_IPHONE_PRO },
      { id: '6d8adc71-c192-4a95-b40a-9db1a412a29d', size: '512GB', color: 'Burgundy', colorHex: '#632934', price: 6999, stock: 7, image: IMG_IPHONE_PRO },
    ],
  },
  {
    id: 'apple-iphone-18-pro',
    item_group_id: 'APPLE-IPHONE-18-PRO',
    name: 'Apple iPhone 18 Pro',
    brand: 'Apple',
    category: 'iphone',
    description:
      'Compact 6.3-inch Pro smartphone engineered in precision-brushed titanium with A20 Pro performance, 4K 120fps Dolby Vision capture, and all-day battery endurance.',
    price: 5499,
    images: [IMG_IPHONE_PRO, IMG_HERO_IPHONE],
    stock: 50,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Display', value: '6.3-inch Super Retina XDR OLED, 120Hz' },
      { label: 'Chip', value: 'A20 Pro chip' },
      { label: 'Camera', value: 'Pro 48MP Triple Camera System' },
      { label: 'Connector', value: 'USB-C with DisplayPort support' },
    ],
    variants: [
      { id: '67fcb52d-ea01-4b91-9eab-21d467c82b3e', size: '256GB', color: 'Black', colorHex: '#1D1D1F', price: 5499, stock: 22, image: IMG_IPHONE_PRO },
      { id: 'ip18p-512-blk', size: '512GB', color: 'Black', colorHex: '#1D1D1F', price: 6499, stock: 15, image: IMG_IPHONE_PRO },
      { id: 'ip18p-1tb-slv', size: '1TB', color: 'Silver', colorHex: '#D2D2D7', price: 7999, stock: 13, image: IMG_HERO_IPHONE },
    ],
  },
  {
    id: 'apple-macbook-pro-14-m5',
    item_group_id: 'APPLE-MACBOOK-PRO-14',
    name: 'MacBook Pro 14-inch (M5 Pro)',
    brand: 'Apple',
    category: 'mac',
    description:
      'Powerhouse portable Mac featuring the M5 Pro chip, 14.2-inch Liquid Retina XDR display at 1,600 nits peak brightness, 24GB unified memory, and Thunderbolt 5.',
    price: 7499,
    original_price: 7999,
    images: [IMG_MACBOOK_PRO],
    stock: 20,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Display', value: '14.2-inch Liquid Retina XDR, ProMotion 120Hz' },
      { label: 'Chip', value: 'Apple M5 Pro (12-core CPU, 18-core GPU)' },
      { label: 'Memory', value: '24GB Unified Memory' },
      { label: 'Ports', value: '3x Thunderbolt 5, HDMI, SDXC, MagSafe 3' },
    ],
    variants: [
      { id: 'mbp14-512-sb', size: '512GB SSD', color: 'Space Black', colorHex: '#252629', price: 7499, original_price: 7999, stock: 12, image: IMG_MACBOOK_PRO },
      { id: 'mbp14-1tb-sb', size: '1TB SSD', color: 'Space Black', colorHex: '#252629', price: 8499, stock: 8, image: IMG_MACBOOK_PRO },
      { id: 'mbp14-1tb-slv', size: '1TB SSD', color: 'Silver', colorHex: '#D8D8DC', price: 8499, stock: 6, image: IMG_MACBOOK_PRO },
    ],
  },
  {
    id: 'apple-macbook-air-13-m4',
    item_group_id: 'APPLE-MACBOOK-AIR-13',
    name: 'MacBook Air 13-inch (M4)',
    brand: 'Apple',
    category: 'mac',
    description:
      'Remarkably thin 11.5mm fanless laptop powered by Apple M4 silicon with 16GB unified memory, MagSafe charging, and up to 18 hours of battery life.',
    price: 4799,
    original_price: 5199,
    images: [IMG_MACBOOK_PRO],
    stock: 28,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Display', value: '13.6-inch Liquid Retina display' },
      { label: 'Chip', value: 'Apple M4 (10-core CPU, 10-core GPU)' },
      { label: 'Memory', value: '16GB Unified Memory' },
      { label: 'Weight', value: '1.24 kg' },
    ],
    variants: [
      { id: 'mba13-256-mdn', size: '256GB SSD', color: 'Midnight', colorHex: '#1F242D', price: 4799, original_price: 5199, stock: 16, image: IMG_MACBOOK_PRO },
      { id: 'mba13-512-stl', size: '512GB SSD', color: 'Starlight', colorHex: '#E3DDD2', price: 5699, stock: 12, image: IMG_MACBOOK_PRO },
    ],
  },
  {
    id: 'apple-ipad-pro-13-m5',
    item_group_id: 'APPLE-IPAD-PRO-13',
    name: 'iPad Pro 13-inch (M5)',
    brand: 'Apple',
    category: 'ipad',
    description:
      'Ultra-thin 5.1mm aluminum design paired with the Tandem OLED Ultra Retina XDR display and M5 chip for studio illustration, video grading, and mobile productivity.',
    price: 5999,
    images: [IMG_IPAD_PRO],
    stock: 19,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Display', value: '13-inch Ultra Retina XDR Tandem OLED' },
      { label: 'Chip', value: 'Apple M5 chip' },
      { label: 'Thickness', value: '5.1 mm' },
      { label: 'Compatibility', value: 'Apple Pencil Pro & Magic Keyboard' },
    ],
    variants: [
      { id: 'ipp13-256-slv', size: '256GB · Wi-Fi', color: 'Silver', colorHex: '#D8D8DC', price: 5999, stock: 11, image: IMG_IPAD_PRO },
      { id: 'ipp13-512-sb', size: '512GB · Wi-Fi', color: 'Space Black', colorHex: '#252629', price: 6899, stock: 8, image: IMG_IPAD_PRO },
      { id: 'ipp13-1tb-cell', size: '1TB · Wi-Fi + Cellular', color: 'Space Black', colorHex: '#252629', price: 9499, stock: 4, image: IMG_IPAD_PRO },
    ],
  },
  {
    id: 'apple-watch-ultra-3',
    item_group_id: 'APPLE-WATCH-ULTRA-3',
    name: 'Apple Watch Ultra 3',
    brand: 'Apple',
    category: 'apple-watch',
    description:
      'Rugged 49mm aerospace-grade titanium smartwatch with dual-frequency GPS, 3,000-nit LTPO OLED display, 100m water resistance, and multi-day expedition battery.',
    price: 3799,
    images: [IMG_APPLE_WATCH],
    stock: 24,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Case', value: '49mm Natural or Black Titanium' },
      { label: 'Water Resistance', value: '100m (EN13319 dive certified to 40m)' },
      { label: 'Battery Life', value: 'Up to 36 hours (72 hours Low Power Mode)' },
      { label: 'Connectivity', value: 'GPS + Cellular, Precision Dual-Frequency' },
    ],
    variants: [
      { id: 'awu3-49-nat-alp', size: '49mm · Alpine Loop', color: 'Natural Titanium', colorHex: '#ADA69C', price: 3799, stock: 14, image: IMG_APPLE_WATCH },
      { id: 'awu3-49-blk-trl', size: '49mm · Trail Loop', color: 'Black Titanium', colorHex: '#232325', price: 3799, stock: 10, image: IMG_APPLE_WATCH },
    ],
  },
  {
    id: 'apple-watch-series-11',
    item_group_id: 'APPLE-WATCH-SERIES-11',
    name: 'Apple Watch Series 11',
    brand: 'Apple',
    category: 'apple-watch',
    description:
      'Our thinnest Apple Watch ever with wide-angle OLED display, sleep apnea notifications, fast charging, and seamless everyday fitness tracking.',
    price: 1899,
    images: [IMG_APPLE_WATCH],
    stock: 32,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Case Size', value: '42mm or 46mm Aluminum' },
      { label: 'Chip', value: 'S11 SiP with 64-bit dual-core processor' },
      { label: 'Water Resistance', value: '50m swimproof' },
    ],
    variants: [
      { id: 'aws11-42-jet', size: '42mm · GPS', color: 'Jet Black', colorHex: '#171718', price: 1899, stock: 18, image: IMG_APPLE_WATCH },
      { id: 'aws11-46-slv', size: '46mm · GPS', color: 'Silver', colorHex: '#D8D8DC', price: 2049, stock: 14, image: IMG_APPLE_WATCH },
    ],
  },
  {
    id: 'apple-airpods-pro-3',
    item_group_id: 'APPLE-AIRPODS-PRO-3',
    name: 'AirPods Pro 3',
    brand: 'Apple',
    category: 'airpods',
    description:
      'Next-generation Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and a MagSafe Charging Case (USB-C) with Precision Finding speaker.',
    price: 1099,
    images: [IMG_AIRPODS_PRO],
    stock: 45,
    is_featured: true,
    is_new: true,
    is_available: true,
    specifications: [
      { label: 'Audio', value: 'Custom high-excursion Apple driver & H3 chip' },
      { label: 'Listening Time', value: 'Up to 6 hours (30 hours with case)' },
      { label: 'Resistance', value: 'IP54 dust, sweat, and water resistant' },
      { label: 'Charging', value: 'MagSafe, Apple Watch charger, USB-C' },
    ],
    variants: [
      { id: 'app3-usbc-wht', size: 'USB-C MagSafe Case', color: 'White', colorHex: '#F2F2F4', price: 1099, stock: 45, image: IMG_AIRPODS_PRO },
    ],
  },
  {
    id: 'apple-airpods-max-usbc',
    item_group_id: 'APPLE-AIRPODS-MAX',
    name: 'AirPods Max (USB-C)',
    brand: 'Apple',
    category: 'airpods',
    description:
      'Over-ear high-fidelity wireless headphones crafted with anodized aluminum ear cups, memory foam cushions, lossless USB-C audio, and pro-level noise cancellation.',
    price: 2299,
    original_price: 2499,
    images: [IMG_AIRPODS_PRO],
    stock: 15,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Driver', value: 'Apple-designed 40mm dynamic driver' },
      { label: 'Battery', value: 'Up to 20 hours with ANC enabled' },
      { label: 'Connector', value: 'USB-C for charging & lossless audio' },
    ],
    variants: [
      { id: 'apm-mdn', size: 'One Size', color: 'Midnight', colorHex: '#252932', price: 2299, original_price: 2499, stock: 8, image: IMG_AIRPODS_PRO },
      { id: 'apm-stl', size: 'One Size', color: 'Starlight', colorHex: '#DDD6C8', price: 2299, original_price: 2499, stock: 7, image: IMG_AIRPODS_PRO },
    ],
  },
  {
    id: 'apple-homepod-2nd-gen',
    item_group_id: 'APPLE-HOMEPOD-2',
    name: 'HomePod (2nd Gen)',
    brand: 'Apple',
    category: 'apple-tv-home',
    description:
      'Room-filling acoustic powerhouse with computational audio, Spatial Audio support, built-in temperature and humidity sensors, and Matter smart-home hub.',
    price: 1549,
    images: [IMG_HOMEPOD_TV],
    stock: 16,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Acoustics', value: '4-inch high-excursion woofer + 5 beamforming tweeters' },
      { label: 'Smart Home', value: 'Thread, Matter, HomeKit hub' },
      { label: 'Connectivity', value: 'Wi-Fi 802.11n, Ultra Wideband' },
    ],
    variants: [
      { id: 'hp2-mdn', size: 'Standard', color: 'Midnight', colorHex: '#1D2026', price: 1549, stock: 10, image: IMG_HOMEPOD_TV },
      { id: 'hp2-wht', size: 'Standard', color: 'White', colorHex: '#EFEFF1', price: 1549, stock: 6, image: IMG_HOMEPOD_TV },
    ],
  },
  {
    id: 'apple-tv-4k',
    item_group_id: 'APPLE-TV-4K',
    name: 'Apple TV 4K (Wi-Fi + Ethernet)',
    brand: 'Apple',
    category: 'apple-tv-home',
    description:
      '4K Dolby Vision and HDR10+ cinema at home powered by the A15 Bionic chip, complete with Gigabit Ethernet, Thread mesh networking, and Siri Remote (USB-C).',
    price: 699,
    images: [IMG_HOMEPOD_TV],
    stock: 26,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Storage', value: '128GB' },
      { label: 'Video', value: '4K Dolby Vision, HDR10+' },
      { label: 'Networking', value: 'Wi-Fi 6, Gigabit Ethernet, Thread' },
    ],
    variants: [
      { id: 'atv4k-128-eth', size: '128GB · Wi-Fi + Ethernet', color: 'Black', colorHex: '#1D1D1F', price: 699, stock: 26, image: IMG_HOMEPOD_TV },
    ],
  },
  {
    id: 'apple-magsafe-charger-2m',
    item_group_id: 'APPLE-MAGSAFE-2M',
    name: 'Apple MagSafe Charger (2m)',
    brand: 'Apple',
    category: 'accessories',
    description:
      'Snap-on magnetic wireless charging up to 25W for compatible iPhone models, featuring a durable 2-metre woven USB-C cable and Qi2 compatibility.',
    price: 219,
    images: [IMG_ACCESSORIES],
    stock: 60,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Output', value: 'Up to 25W faster wireless charging' },
      { label: 'Cable Length', value: '2 metres braided USB-C' },
      { label: 'Compatibility', value: 'iPhone 12 and later, AirPods with MagSafe Case' },
    ],
    variants: [
      { id: 'ms-2m-slv', size: '2m Cable', color: 'Silver / White', colorHex: '#E5E5EA', price: 219, stock: 60, image: IMG_ACCESSORIES },
    ],
  },
  {
    id: 'apple-pencil-pro',
    item_group_id: 'APPLE-PENCIL-PRO',
    name: 'Apple Pencil Pro',
    brand: 'Apple',
    category: 'accessories',
    description:
      'Pixel-perfect precision with squeeze gestures, barrel roll gyroscope control, custom haptic feedback, and Apple Find My integration.',
    price: 599,
    images: [IMG_IPAD_PRO],
    stock: 34,
    is_featured: false,
    is_new: false,
    is_available: true,
    specifications: [
      { label: 'Interactions', value: 'Squeeze, Barrel Roll, Hover, Double-tap' },
      { label: 'Charging', value: 'Magnetic attach & pairing' },
      { label: 'Compatibility', value: 'iPad Pro (M4/M5) and iPad Air (M2/M3)' },
    ],
    variants: [
      { id: 'ap-pro-wht', size: 'Standard', color: 'White', colorHex: '#F5F5F7', price: 599, stock: 34, image: IMG_IPAD_PRO },
    ],
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Amirul Hakim',
  email: 'appletheexchangetrx@gmail.com',
  phone: '+60 12-345 6789',
  avatarInitials: 'AH',
  wishlist: ['apple-iphone-18-pro-max', 'apple-airpods-pro-3'],
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

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-trx-1001',
    orderNumber: 'TRX-2026-8412',
    createdAt: '2026-11-18T10:15:00+08:00',
    updatedAt: '2026-11-19T16:40:00+08:00',
    status: 'processing',
    paymentStatus: 'undecided',
    shippingAddress: DEFAULT_PROFILE.addresses[0],
    items: [
      {
        productId: 'apple-airpods-pro-3',
        variantId: 'app3-usbc-wht',
        name: 'AirPods Pro 3',
        variantSummary: 'White · USB-C MagSafe Case',
        unitPrice: 1099,
        quantity: 1,
        image: IMG_AIRPODS_PRO,
      },
      {
        productId: 'apple-magsafe-charger-2m',
        variantId: 'ms-2m-slv',
        name: 'Apple MagSafe Charger (2m)',
        variantSummary: 'Silver / White · 2m Cable',
        unitPrice: 219,
        quantity: 1,
        image: IMG_ACCESSORIES,
      },
    ],
    subtotal: 1318,
    shippingFee: 52,
    discount: 0,
    total: 1370,
    trackingTimeline: [
      {
        key: 'order_placed',
        label: 'Order Placed',
        description: 'Received by Apple The Exchange TRX',
        timestamp: '2026-11-18T10:15:00+08:00',
        completed: true,
        current: false,
      },
      {
        key: 'processing',
        label: 'Processing',
        description: 'Preparing & inspecting Apple hardware at TRX fulfilment desk',
        timestamp: '2026-11-19T16:40:00+08:00',
        completed: true,
        current: true,
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
  },
];

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
    title: 'iPhone 18 Pro Max Now Available',
    message: 'Explore Black, Silver, Glacier, and Burgundy finishes up to 2TB in MYR.',
    timestamp: '2026-11-18T09:00:00+08:00',
    read: false,
    actionPath: '/product/apple-iphone-18-pro-max',
    actionLabel: 'View iPhone 18 Pro Max',
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
