import React, { useState } from 'react';
import {
  Cable,
  ChevronRight,
  Headphones,
  Laptop,
  Smartphone,
  Tablet,
  Tv,
  Watch,
  Zap,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, HERO_SLIDES, PROMOTIONS } from '../data/catalog';
import type { CategoryId } from '../types/store';

const CATEGORY_ICON_MAP: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  iphone: Smartphone,
  mac: Laptop,
  ipad: Tablet,
  'apple-watch': Watch,
  airpods: Headphones,
  'apple-tv-home': Tv,
  accessories: Cable,
};

export const HomePage: React.FC = () => {
  const { products, productsLoading, productsError, refreshProducts, navigate } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);

  const activeSlide = HERO_SLIDES[heroIndex] || HERO_SLIDES[0];
  const flashSaleProducts = products
    .filter((product) => product.custom_label_0?.trim().toLowerCase() === 'flash_sale')
    .slice(0, 4);
  const latestProducts = [...products]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 4);
  const availableCategories = CATEGORIES.filter((category) =>
    products.some((product) => product.category === category.id)
  );

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-6">
      {/* HeroBanner */}
      <section aria-label="Featured showcase" className="relative -mx-4 -mt-4 rounded-none overflow-hidden bg-[#1D1D1F] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="relative w-full aspect-[16/11] bg-[#1D1D1F]">
          <ResilientImage
            src={activeSlide.image}
            alt={activeSlide.title}
            fallbackTitle={activeSlide.title}
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[11px] font-semibold tracking-wide text-white/80">
              {activeSlide.eyebrow}
            </p>
            <h1 className="text-[24px] font-bold leading-[1.2] tracking-tight mt-1 text-balance">
              {activeSlide.title}
            </h1>
            <p className="text-[13px] text-white/85 leading-[1.45] mt-1.5 line-clamp-2">
              {activeSlide.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(activeSlide.targetPath)}
                className="h-[44px] px-4 rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <span>{activeSlide.ctaLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* PaginationIndicator */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slides">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === heroIndex}
                    aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section aria-label="Flash Sale" className="-mx-4 rounded-none bg-[#E84135] p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/20 !text-white flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h2 className="text-[18px] font-semibold !text-white">
                  Flash Sale
                </h2>
                <p className="text-[11px] !text-white/80">
                  Limited-time offers
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/products?promotion=flash_sale')}
              className="min-h-[44px] px-1 text-[13px] font-medium !text-white/90 hover:!text-white inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mr-4 pr-4">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="relative min-w-0 w-[35%] max-w-[35%] shrink-0 snap-start">
                <span className="absolute z-10 top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#C92F28] px-2 py-1 text-[9px] font-bold text-white shadow-sm">
                  <Zap className="w-3 h-3 fill-current" />
                  FLASH SALE
                </span>
                <ProductCard product={product} variant="flash-sale" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FeaturedCategories */}
      <section aria-label="Categories">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Shop by Category
          </h2>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="min-h-[44px] px-1 text-[13px] font-medium text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 whitespace-nowrap"
          >
            <span>All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {availableCategories.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category.id];
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="shrink-0 w-[86px] rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-3 flex flex-col items-center justify-center gap-2 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#0071E3] dark:hover:border-[#2997FF] transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight line-clamp-2">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Our Products */}
      <section aria-label="Our Products">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Our Products
          </h2>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="min-h-[44px] px-1 text-[13px] font-medium text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 whitespace-nowrap"
          >
            <span>Explore Store</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {productsError ? (
          <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-6 text-center">
            <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">{productsError}</p>
            <button
              type="button"
              onClick={() => void refreshProducts().catch(() => undefined)}
              className="mt-3 h-[40px] px-4 rounded-[10px] bg-[#0071E3] text-white text-[13px] font-semibold"
            >
              Retry
            </button>
          </div>
        ) : productsLoading ? (
          <p className="py-8 text-center text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Loading products...
          </p>
        ) : latestProducts.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
            No products are available right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotions */}
      <section aria-label="Store Highlights">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            At The Exchange TRX
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-stretch"
            >
              <div className="w-[116px] shrink-0 bg-[#F5F5F7] dark:bg-[#2C2C2E]">
                <ResilientImage
                  src={promo.image}
                  alt={promo.title}
                  fallbackTitle={promo.title}
                  className="w-full h-full object-cover block"
                />
              </div>
              <div className="flex-1 p-3.5 flex flex-col justify-between gap-2 min-w-0">
                <div>
                  <p className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6]">
                    {promo.eyebrow}
                  </p>
                  <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-snug mt-0.5">
                    {promo.title}
                  </h3>
                  <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1 line-clamp-2">
                    {promo.description}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(promo.targetPath)}
                    className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 min-h-[32px]"
                  >
                    <span>{promo.ctaLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
