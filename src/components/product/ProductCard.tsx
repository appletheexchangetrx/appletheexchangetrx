import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/store';
import { formatMYR } from '../../utils/storage';
import { ResilientImage } from '../ui/ResilientImage';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { navigate, profile, toggleWishlist } = useStore();
  const defaultVariant = product.variants[0];
  const isWishlisted = profile.wishlist.includes(product.id);

  const hasDiscount =
    typeof product.original_price === 'number' && product.original_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  if (layout === 'list') {
    return (
      <article className="rounded-[16px] bg-white dark:bg-[#1C1C1E] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-stretch border border-[#E8E8ED]/80 dark:border-[#2C2C2E]">
        <a
          href={`/product/${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${product.id}`);
          }}
          className="relative w-[112px] shrink-0 aspect-square bg-[#F5F5F7] dark:bg-[#2C2C2E] block overflow-hidden"
        >
          <ResilientImage
            src={product.images[0]}
            alt={product.name}
            fallbackTitle={product.name}
            className="w-full h-full object-contain block"
          />
          {(product.is_new || hasDiscount) && (
            <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#1C1C1E]/90 text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#E8E8ED] dark:border-[#38383A]">
              {hasDiscount ? `-${discountPct}%` : 'New'}
            </span>
          )}
        </a>

        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-start justify-between gap-2">
              <a
                href={`/product/${product.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/product/${product.id}`);
                }}
                className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.35] line-clamp-2 hover:text-[#0071E3] dark:hover:text-[#2997FF]"
              >
                {product.name}
              </a>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
                className="w-9 h-9 -mr-1 -mt-1 flex items-center justify-center rounded-full text-[#6E6E73] dark:text-[#A1A1A6] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-[#D70015] text-[#D70015] dark:fill-[#FF453A] dark:text-[#FF453A]' : ''}`}
                />
              </button>
            </div>
            <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5 truncate">
              {defaultVariant ? `${defaultVariant.color} · ${defaultVariant.size}` : product.brand}
            </p>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[15px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-[#86868B] line-through tabular-nums">
                {formatMYR(product.original_price!)}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[16px] bg-white dark:bg-[#1C1C1E] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E8E8ED]/80 dark:border-[#2C2C2E] flex flex-col">
      {/* Image Container: 1:1, padding 0, rounded-t-16, rounded-b-0 */}
      <div className="relative w-full aspect-square bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-t-[16px] rounded-b-none overflow-hidden">
        <a
          href={`/product/${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${product.id}`);
          }}
          className="block w-full h-full"
          aria-label={`View ${product.name}`}
        >
          <ResilientImage
            src={product.images[0]}
            alt={product.name}
            fallbackTitle={product.name}
            className="w-full h-full object-contain block"
          />
        </a>

        {(product.is_new || hasDiscount) && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#1C1C1E]/90 text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#E8E8ED] dark:border-[#38383A]">
            {hasDiscount ? `Save ${discountPct}%` : 'New'}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
          className="absolute top-1.5 right-1.5 w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-sm text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#D70015] text-[#D70015] dark:fill-[#FF453A] dark:text-[#FF453A]' : ''}`}
          />
        </button>
      </div>

      {/* Content: padding 0, gap 8 */}
      <div className="flex-1 flex flex-col justify-between gap-[8px]">
        <div>
          <a
            href={`/product/${product.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.id}`);
            }}
            className="block text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.35] line-clamp-2 hover:text-[#0071E3] dark:hover:text-[#2997FF]"
          >
            {product.name}
          </a>
        </div>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
            {formatMYR(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-[#86868B] line-through tabular-nums">
              {formatMYR(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
