import type { CategoryId, Product, ProductVariant } from '../types/store';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://axednjikcambzbkxyqpp.supabase.co';

// Publishable keys are designed for browser clients. Never place a service-role/secret key here.
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Vysddy5_b0uZ3iKgnkDTIw_X5O1pBEd';

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
  description?: string | null;
  availability?: string | null;
  quantity_to_sell_on_facebook?: string | number | null;
  created_at?: string | null;
  variants?: RawVariant[] | null;
}

const CATEGORY_MAP: Record<string, CategoryId> = {
  'Apple iPhone': 'iphone',
  'Apple Mac': 'mac',
  'Apple iPad': 'ipad',
  'Apple Watch': 'apple-watch',
  'Apple AirPods': 'airpods',
};

const COLOR_HEX: Record<string, string> = {
  black: '#1D1D1F',
  midnight: '#252932',
  silver: '#D2D2D7',
  white: '#F5F5F7',
  blue: '#4F83CC',
  pink: '#F4B8C4',
  purple: '#A98BD4',
  starlight: '#E3DDD2',
  orange: '#E68A45',
  natural: '#ADA69C',
  titanium: '#ADA69C',
  graphite: '#53565A',
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
  const normalized = color.toLowerCase();
  const exact = COLOR_HEX[normalized];
  if (exact) return exact;
  const match = Object.entries(COLOR_HEX).find(([name]) => normalized.includes(name));
  return match?.[1] || '#D2D2D7';
}

function mapProduct(raw: RawProduct): Product {
  const variants: ProductVariant[] = (Array.isArray(raw.variants) ? raw.variants : []).map((item) => {
    const regularPrice = toNumber(item.price);
    const salePrice = toOptionalNumber(item.sale_price);
    const color = item.color?.trim() || 'Standard';
    const images = Array.from(new Set([
      ...imageUrls(item.image_link),
      ...imageUrls(item.additional_image_link),
    ]));
    const image = images[0] || '';

    return {
      id: String(item.id ?? ''),
      size: item.size?.trim() || 'Standard',
      color,
      colorHex: colorHex(color),
      price: salePrice ?? regularPrice,
      original_price: salePrice !== undefined && salePrice < regularPrice ? regularPrice : undefined,
      image,
      images,
    };
  }).filter((variant) => variant.id.length > 0);

  const firstVariant = variants[0];
  const images = Array.from(new Set(
    (Array.isArray(raw.variants) ? raw.variants : []).flatMap((variant) => [
      ...imageUrls(variant.image_link),
      ...imageUrls(variant.additional_image_link),
    ])
  ));
  const stock = toNumber(raw.quantity_to_sell_on_facebook);
  const productType = raw.product_type?.trim() || '';

  return {
    id: String(raw.item_group_id ?? ''),
    item_group_id: String(raw.item_group_id ?? ''),
    name: raw.title?.trim() || 'Apple Product',
    brand: raw.brand?.trim() || 'Apple',
    category: CATEGORY_MAP[productType] || 'accessories',
    description: raw.description?.trim() || '',
    price: firstVariant?.price ?? 0,
    original_price: firstVariant?.original_price,
    images,
    stock,
    variants,
    is_available: (raw.availability || '').trim().toLowerCase() === 'in stock',
    created_at: raw.created_at || '',
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-products`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to load products (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('success' in payload) ||
    payload.success !== true ||
    !('data' in payload) ||
    !Array.isArray(payload.data)
  ) {
    throw new Error('The product service returned an invalid response.');
  }

  return (payload.data as RawProduct[])
    .map(mapProduct)
    .filter((product) => product.id.length > 0 && product.variants.length > 0);
}
