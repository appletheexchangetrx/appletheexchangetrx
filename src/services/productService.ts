import type { CategoryId, Product, ProductVariant } from '../types/store';
import { supabase } from '../utils/supabase';

interface RawVariant {
  id?: string | number;
  size?: string | null;
  color?: string | null;
  price?: string | number | null;
  sale_price?: string | number | null;
  image_link?: string | null;
  additional_image_link?: string | string[] | null;
}

interface RawProduct {
  item_group_id?: string | number;
  title?: string | null;
  brand?: string | null;
  product_type?: string | null;
  google_product_category?: string | null;
  description?: string | null;
  rich_text_description?: string | null;
  availability?: string | null;
  condition?: string | null;
  quantity_to_sell_on_facebook?: string | number | null;
  created_at?: string | null;
  updated_at?: string | null;
  custom_label_0?: string | null;
  custom_label_1?: string | null;
  custom_label_2?: string | null;
  sale_price_effective_date?: string | null;
  variants?: RawVariant[] | null;
}

const CATEGORY_MAP: Record<string, CategoryId> = {
  'Apple iPhone': 'iphone',
  'Apple Mac': 'mac',
  'Apple iPad': 'ipad',
  'Apple Watch': 'apple-watch',
  'Apple AirPods': 'airpods',
  'Apple TV & Home': 'apple-tv-home',
  'Apple Accessories': 'accessories',
};

const COLOR_HEX: Record<string, string> = {
  black: '#1D1D1F',
  'jet black': '#171718',
  'jet black aluminium': '#171718',
  'black titanium': '#232325',
  'space black': '#252629',
  'space grey': '#7D7E80',
  'space gray': '#7D7E80',
  graphite: '#53565A',
  midnight: '#252932',
  'midnight aluminium': '#252932',
  silver: '#D2D2D7',
  white: '#F5F5F7',
  'star white': '#F4F3EF',
  'cloud white': '#F2F3F5',
  starlight: '#E3DDD2',
  'light gold': '#E5CFA0',
  gold: '#DFC592',
  blue: '#4F83CC',
  ultramarine: '#4C68D7',
  'sky blue': '#A8CBE8',
  'mist blue': '#9EB6C8',
  glacier: '#BFD4E2',
  burgundy: '#632934',
  pink: '#F4B8C4',
  purple: '#A98BD4',
  lavender: '#C9B8E8',
  sage: '#A7B8A8',
  orange: '#E68A45',
  natural: '#ADA69C',
  'natural titanium': '#ADA69C',
  titanium: '#ADA69C',
  'dark bronze': '#6E5544',
  'dark bronze aluminium': '#6E5544',
  space: '#252629',
};

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function toOptionalNumber(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function imageUrls(value: string | string[] | null | undefined): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function colorHex(color: string): string {
  const normalized = color.toLowerCase().trim();
  const exact = COLOR_HEX[normalized];
  if (exact) return exact;
  const match = Object.entries(COLOR_HEX).find(([name]) => normalized.includes(name));
  return match?.[1] || '#D2D2D7';
}

function mapCategory(productType: string, googleCategory: string): CategoryId {
  if (CATEGORY_MAP[productType]) {
    return CATEGORY_MAP[productType];
  }
  const combined = `${productType} ${googleCategory}`.toLowerCase();
  if (combined.includes('iphone')) return 'iphone';
  if (combined.includes('mac') || combined.includes('computer') || combined.includes('laptop')) return 'mac';
  if (combined.includes('ipad') || combined.includes('tablet')) return 'ipad';
  if (combined.includes('watch')) return 'apple-watch';
  if (combined.includes('airpods') || combined.includes('headphone')) return 'airpods';
  if (combined.includes('apple tv') || combined.includes('homepod')) return 'apple-tv-home';
  return 'accessories';
}

function mapProduct(raw: RawProduct): Product {
  const variants: ProductVariant[] = (Array.isArray(raw.variants) ? raw.variants : [])
    .map((item) => {
      const regularPrice = toNumber(item.price);
      const salePrice = toOptionalNumber(item.sale_price);
      const color = item.color?.trim() || 'Standard';
      const images = Array.from(
        new Set([
          ...imageUrls(item.image_link),
          ...imageUrls(item.additional_image_link),
        ])
      );
      const image = images[0] || '';

      return {
        id: String(item.id ?? ''),
        size: item.size?.trim() || 'Standard',
        color,
        colorHex: colorHex(color),
        price: salePrice ?? regularPrice,
        original_price:
          salePrice !== undefined && salePrice < regularPrice ? regularPrice : undefined,
        image,
        images,
      };
    })
    .filter((variant) => variant.id.length > 0);

  const lowestVariant = variants.reduce<ProductVariant | undefined>(
    (best, current) => (!best || current.price < best.price ? current : best),
    variants[0]
  );

  const images = Array.from(
    new Set(
      (Array.isArray(raw.variants) ? raw.variants : []).flatMap((variant) => [
        ...imageUrls(variant.image_link),
        ...imageUrls(variant.additional_image_link),
      ])
    )
  );

  const availability = (raw.availability || 'in stock').trim().toLowerCase();
  const isOrderableStatus =
    availability === 'in stock' ||
    availability === 'preorder' ||
    availability === 'available for order';
  const rawStock = raw.quantity_to_sell_on_facebook;
  const stock =
    rawStock === null || rawStock === undefined || rawStock === ''
      ? isOrderableStatus
        ? 20
        : 0
      : toNumber(rawStock);

  const productType = raw.product_type?.trim() || '';
  const googleCategory = raw.google_product_category?.trim() || '';

  return {
    id: String(raw.item_group_id ?? ''),
    item_group_id: String(raw.item_group_id ?? ''),
    name: raw.title?.trim() || 'Apple Product',
    brand: raw.brand?.trim() || 'Apple',
    category: mapCategory(productType, googleCategory),
    description: raw.description?.trim() || '',
    price: lowestVariant?.price ?? 0,
    original_price: lowestVariant?.original_price,
    images,
    stock,
    variants,
    availability,
    condition: raw.condition?.trim().toLowerCase() || 'new',
    custom_label_0: raw.custom_label_0 ?? null,
    custom_label_1: raw.custom_label_1 ?? null,
    custom_label_2: raw.custom_label_2 ?? null,
    sale_price_effective_date: raw.sale_price_effective_date ?? null,
    google_product_category: googleCategory || undefined,
    is_available: isOrderableStatus && stock > 0,
    created_at: raw.created_at || '',
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (!error && Array.isArray(data)) {
    return (data as RawProduct[])
      .map(mapProduct)
      .filter((product) => product.id.length > 0 && product.variants.length > 0);
  }

  const { data: fnPayload, error: fnError } = await supabase.functions.invoke<{
    success?: boolean;
    data?: RawProduct[];
  }>('get-products', { method: 'GET' });

  if (fnError) {
    throw new Error(fnError.message || error?.message || 'Unable to load products.');
  }

  if (!fnPayload || fnPayload.success !== true || !Array.isArray(fnPayload.data)) {
    throw new Error('The product service returned an invalid response.');
  }

  return fnPayload.data
    .map(mapProduct)
    .filter((product) => product.id.length > 0 && product.variants.length > 0);
}
