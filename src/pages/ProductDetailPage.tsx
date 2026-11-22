import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Undo2,
} from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { ProductCard } from '../components/product/ProductCard';
import { BottomSheet } from '../components/ui/Overlay';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useStore } from '../context/StoreContext';
import { formatMYR } from '../utils/storage';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const {
    products,
    getProductById,
    goBack,
    navigate,
    cartCount,
    addToCart,
    buyNow,
    profile,
    toggleWishlist,
  } = useStore();

  const product = getProductById(productId);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants[0]?.id || ''
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'delivery' | 'returns' | 'warranty' | null>(
    'delivery'
  );
  const [variantSheetMode, setVariantSheetMode] = useState<'cart' | 'buy' | null>(null);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const set = new Set<string>();
    if (selectedVariant?.image) set.add(selectedVariant.image);
    product.images.forEach((img) => set.add(img));
    return Array.from(set);
  }, [product, selectedVariant]);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const seen = new Map<string, string>();
    product.variants.forEach((v) => {
      if (!seen.has(v.color)) seen.set(v.color, v.colorHex);
    });
    return Array.from(seen.entries()).map(([color, hex]) => ({ color, hex }));
  }, [product]);

  const sizesForColor = useMemo(() => {
    if (!product || !selectedVariant) return [];
    return product.variants.filter((v) => v.color === selectedVariant.color);
  }, [product, selectedVariant]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
      .slice(0, 4);
  }, [product, products]);

  if (!product || !selectedVariant) {
    return (
      <StandaloneShell title="Product Not Found" backFallback="/products">
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Product unavailable
          </h2>
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
            This Apple product could not be found in the current catalog.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] text-white text-[14px] font-semibold"
          >
            Back to Store
          </button>
        </div>
      </StandaloneShell>
    );
  }

  const isWishlisted = profile.wishlist.includes(product.id);
  const currentPrice = selectedVariant.price;
  const originalPrice = selectedVariant.original_price ?? product.original_price;
  const hasDiscount = typeof originalPrice === 'number' && originalPrice > currentPrice;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice! - currentPrice) / originalPrice!) * 100)
    : 0;
  const maxStock = selectedVariant.stock;

  const handleSelectColor = (color: string) => {
    const matchSameSize = product.variants.find(
      (v) => v.color === color && v.size === selectedVariant.size
    );
    const fallback = product.variants.find((v) => v.color === color);
    const next = matchSameSize || fallback;
    if (next) {
      setSelectedVariantId(next.id);
      setActiveImageIdx(0);
      setQuantity((q) => Math.min(q, Math.max(1, next.stock)));
    }
  };

  const handleSelectVariant = (variantId: string) => {
    const next = product.variants.find((v) => v.id === variantId);
    if (next) {
      setSelectedVariantId(next.id);
      setQuantity((q) => Math.min(q, Math.max(1, next.stock)));
    }
  };

  return (
    <StandaloneShell
      customHeader={
        <div className="h-[56px] px-2 flex items-center justify-between gap-2 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md">
          <button
            type="button"
            onClick={() => goBack('/products')}
            aria-label="Go back"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors shrink-0"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.8} />
          </button>

          <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate text-center flex-1">
            {product.name}
          </span>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors shrink-0"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#0071E3] dark:bg-[#2997FF] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      }
      bottomAction={
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!product.is_available}
            onClick={() => setVariantSheetMode('cart')}
            className="h-[48px] rounded-[12px] border border-[#0071E3] dark:border-[#2997FF] text-[#0071E3] dark:text-[#2997FF] text-[14px] font-semibold flex items-center justify-center whitespace-nowrap disabled:opacity-40 transition-colors hover:bg-[#0071E3]/5"
          >
            Add to Bag
          </button>
          <button
            type="button"
            disabled={!product.is_available}
            onClick={() => setVariantSheetMode('buy')}
            className="h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold flex items-center justify-center whitespace-nowrap disabled:opacity-40 transition-colors"
          >
            Buy Now
          </button>
        </div>
      }
    >
      {/* ProductImageGallery */}
      <section className="relative bg-[#F5F5F7] dark:bg-[#2C2C2E]">
        <div className="w-full aspect-square overflow-hidden">
          <ResilientImage
            src={galleryImages[activeImageIdx] || galleryImages[0]}
            alt={`${product.name} in ${selectedVariant.color}`}
            fallbackTitle={product.name}
            className="w-full h-full object-contain block"
          />
        </div>

        {galleryImages.length > 1 && (
          <div className="px-4 pb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors bg-white dark:bg-[#1C1C1E] ${
                    idx === activeImageIdx
                      ? 'border-[#0071E3] dark:border-[#2997FF]'
                      : 'border-transparent opacity-70'
                  }`}
                >
                  <ResilientImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <span className="text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
              {activeImageIdx + 1} / {galleryImages.length}
            </span>
          </div>
        )}
      </section>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* ProductHeading */}
        <section className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6]">
              <span>{product.brand}</span>
              {product.is_new && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#0071E3] dark:text-[#2997FF] font-semibold">New</span>
                </>
              )}
            </div>
            <h1 className="text-[22px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight mt-1">
              {product.name}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={isWishlisted ? 'Remove from favorites' : 'Save to favorites'}
            className="w-[44px] h-[44px] rounded-full bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-center shrink-0"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted
                  ? 'fill-[#D70015] text-[#D70015] dark:fill-[#FF453A] dark:text-[#FF453A]'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            />
          </button>
        </section>

        {/* ProductPricing & Availability */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-[24px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[14px] text-[#86868B] line-through tabular-nums">
                  {formatMYR(originalPrice!)}
                </span>
                <span className="text-[12px] font-semibold text-[#248A3D] dark:text-[#30D158]">
                  Save {discountPct}%
                </span>
              </>
            )}
          </div>
          <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Or from {formatMYR(currentPrice / 12)}/mo for 12 mos · Inclusive of SST
          </p>
          <div className="pt-1 flex items-center gap-2 text-[12px] font-medium">
            {maxStock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[#248A3D] dark:text-[#30D158]">
                <Check className="w-3.5 h-3.5" />
                In Stock ({maxStock} units available)
              </span>
            ) : (
              <span className="text-[#D70015] dark:text-[#FF453A]">Currently Out of Stock</span>
            )}
          </div>
        </section>

        {/* ProductVariantSelector */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-[13px] mb-2.5">
              <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Finish</span>
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">{selectedVariant.color}</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {uniqueColors.map(({ color, hex }) => {
                const active = selectedVariant.color === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    aria-label={`Select color ${color}`}
                    aria-pressed={active}
                    className={`min-h-[44px] px-3 rounded-[12px] border flex items-center gap-2 text-[13px] font-medium transition-colors ${
                      active
                        ? 'border-[#0071E3] dark:border-[#2997FF] bg-[#0071E3]/5 dark:bg-[#2997FF]/10 text-[#1D1D1F] dark:text-[#F5F5F7]'
                        : 'border-[#D2D2D7] dark:border-[#38383A] text-[#1D1D1F] dark:text-[#F5F5F7]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[13px] mb-2.5">
              <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Configuration
              </span>
              <span className="text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                {formatMYR(currentPrice)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {sizesForColor.map((variant) => {
                const active = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleSelectVariant(variant.id)}
                    aria-pressed={active}
                    className={`min-h-[48px] px-3 py-2 rounded-[12px] border text-left transition-colors ${
                      active
                        ? 'border-[#0071E3] dark:border-[#2997FF] bg-[#0071E3]/5 dark:bg-[#2997FF]/10'
                        : 'border-[#D2D2D7] dark:border-[#38383A]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {variant.size}
                    </div>
                    <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                      {formatMYR(variant.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QuantitySelector */}
          <div className="flex items-center justify-between pt-1 border-t border-[#E8E8ED] dark:border-[#2C2C2E]">
            <div>
              <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Quantity
              </span>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                Max {maxStock} per order
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-[40px] h-[40px] rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxStock}
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                className="w-[40px] h-[40px] rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
          <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">
            Overview
          </h2>
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6] leading-[1.6]">
            {product.description}
          </p>
        </section>

        {/* Specifications */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
          <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
            Tech Specs
          </h2>
          <div className="divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="py-2.5 flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6]">
                  {spec.label}
                </span>
                <span className="text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Accordion */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
          {[
            {
              id: 'delivery' as const,
              title: 'Delivery & Shipping',
              Icon: Truck,
              body: 'Insured nationwide courier across Malaysia for a fixed RM 52.00 delivery fee. Dispatched from Apple The Exchange TRX.',
            },
            {
              id: 'returns' as const,
              title: '14-Day Returns',
              Icon: Undo2,
              body: 'Return eligible unopened or undamaged Apple hardware within 14 calendar days of delivery.',
            },
            {
              id: 'warranty' as const,
              title: 'Apple Limited Warranty',
              Icon: ShieldCheck,
              body: 'Every Apple product includes 1 year of hardware repair coverage and 90 days of complimentary technical support.',
            },
          ].map(({ id, title, Icon, body }) => {
            const expanded = openAccordion === id;
            return (
              <div key={id}>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(expanded ? null : id)}
                  aria-expanded={expanded}
                  className="w-full min-h-[52px] px-4 flex items-center justify-between gap-3 text-left"
                >
                  <span className="flex items-center gap-2.5 text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    <Icon className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
                    {title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#86868B] transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expanded && (
                  <p className="px-4 pb-4 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
                    {body}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* RelatedProducts */}
        <section>
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
            You May Also Like
          </h2>
          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1">
            {relatedProducts.map((item) => (
              <div key={item.id} className="w-[172px] shrink-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Variant Selection BottomSheet */}
      <BottomSheet
        open={variantSheetMode !== null}
        onClose={() => setVariantSheetMode(null)}
        title={variantSheetMode === 'buy' ? 'Buy Now — Select Variant' : 'Add to Bag — Select Variant'}
      >
        <div className="flex flex-col gap-4">
          {/* Selected Variant Summary */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#E8E8ED] dark:border-[#2C2C2E]">
            <div className="w-16 h-16 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0">
              <ResilientImage
                src={selectedVariant.image || product.images[0]}
                alt={product.name}
                fallbackTitle={product.name}
                className="w-full h-full object-contain block"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                {product.name}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                  {formatMYR(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[12px] text-[#86868B] line-through tabular-nums">
                    {formatMYR(originalPrice!)}
                  </span>
                )}
              </div>
              <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5 tabular-nums">
                {maxStock > 0 ? `In Stock (${maxStock} available)` : 'Out of Stock'}
              </div>
            </div>
          </div>

          {/* Finish / Color */}
          <div>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Finish</span>
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">{selectedVariant.color}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {uniqueColors.map(({ color, hex }) => {
                const active = selectedVariant.color === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    aria-pressed={active}
                    className={`min-h-[42px] px-3 rounded-[10px] border flex items-center gap-2 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'border-[#0071E3] dark:border-[#2997FF] bg-[#0071E3]/5 dark:bg-[#2997FF]/10 text-[#1D1D1F] dark:text-[#F5F5F7]'
                        : 'border-[#D2D2D7] dark:border-[#38383A] text-[#1D1D1F] dark:text-[#F5F5F7]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size / Configuration */}
          <div>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Configuration
              </span>
              <span className="text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                {formatMYR(currentPrice)}
              </span>
            </div>
            <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {sizesForColor.map((variant) => {
                const active = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleSelectVariant(variant.id)}
                    aria-pressed={active}
                    className={`min-h-[48px] min-w-[120px] px-3.5 py-2 rounded-[10px] border text-left whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'border-[#0071E3] dark:border-[#2997FF] bg-[#0071E3]/5 dark:bg-[#2997FF]/10'
                        : 'border-[#D2D2D7] dark:border-[#38383A]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {variant.size}
                    </div>
                    <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                      {formatMYR(variant.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E8ED] dark:border-[#2C2C2E]">
            <div>
              <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Quantity
              </span>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                Total: {formatMYR(currentPrice * quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-[40px] h-[40px] rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxStock}
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                className="w-[40px] h-[40px] rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confirm CTA */}
          <button
            type="button"
            disabled={maxStock <= 0}
            onClick={() => {
              if (variantSheetMode === 'buy') {
                setVariantSheetMode(null);
                buyNow(product, selectedVariant, quantity);
              } else {
                const ok = addToCart(product, selectedVariant, quantity);
                if (ok) setVariantSheetMode(null);
              }
            }}
            className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold disabled:opacity-40 transition-colors"
          >
            {variantSheetMode === 'buy'
              ? `Continue to Checkout · ${formatMYR(currentPrice * quantity)}`
              : `Add to Bag · ${formatMYR(currentPrice * quantity)}`}
          </button>
        </div>
      </BottomSheet>
    </StandaloneShell>
  );
};
