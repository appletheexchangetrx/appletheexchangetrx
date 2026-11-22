import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { BottomSheet } from '../components/ui/Overlay';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId } from '../types/store';

type SortOption = 'price-asc' | 'price-desc' | 'newest';

export const ProductsPage: React.FC = () => {
  const { products, productsLoading, productsError, refreshProducts, searchQuery, navigate } = useStore();

  const initialCategory = useMemo(() => {
    const params = new URLSearchParams(searchQuery);
    const cat = params.get('category');
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      return cat as CategoryId;
    }
    return 'all';
  }, [searchQuery]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryId>(initialCategory);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(8);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleSelectCategory = (cat: 'all' | CategoryId) => {
    setSelectedCategory(cat);
    setVisibleLimit(8);
    if (cat === 'all') {
      navigate('/products', { replace: true });
    } else {
      navigate(`/products?category=${cat}`, { replace: true });
    }
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (onlyDeals && !(p.original_price && p.original_price > p.price)) return false;
      if (q) {
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
        break;
      default:
        sorted.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    }
    return sorted;
  }, [products, selectedCategory, onlyDeals, query, sortBy]);

  const availableCategories = CATEGORIES.filter((category) =>
    products.some((product) => product.category === category.id)
  );
  const visibleProducts = filteredProducts.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredProducts.length;

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (selectedCategory !== 'all') {
    const catName = CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory;
    activeFilters.push({
      key: 'category',
      label: catName,
      clear: () => handleSelectCategory('all'),
    });
  }
  if (onlyDeals) {
    activeFilters.push({
      key: 'deals',
      label: 'Special Savings',
      clear: () => setOnlyDeals(false),
    });
  }
  if (query.trim()) {
    activeFilters.push({
      key: 'query',
      label: `"${query.trim()}"`,
      clear: () => setQuery(''),
    });
  }

  const clearAllFilters = () => {
    handleSelectCategory('all');
    setQuery('');
    setOnlyDeals(false);
    setSortBy('newest');
    setVisibleLimit(8);
  };

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      {/* PageHeader */}
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-[24px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
          Apple Store
        </h1>
        <span className="text-[13px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* SearchBar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iPhone, Mac, iPad, AirPods..."
          aria-label="Search Apple products"
          className="w-full h-[48px] pl-10 pr-10 rounded-[12px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] dark:focus:border-[#2997FF]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-[#6E6E73] dark:text-[#A1A1A6]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CategoryFilter (Single selection) */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => handleSelectCategory('all')}
          className={`min-h-[38px] px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
              : 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#D2D2D7] dark:border-[#38383A]'
          }`}
        >
          All Apple
        </button>
        {availableCategories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectCategory(cat.id)}
              className={`min-h-[38px] px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#D2D2D7] dark:border-[#38383A]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ProductToolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-[40px] px-3 rounded-[10px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#0071E3]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="h-[40px] px-3 rounded-[10px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex items-center rounded-[10px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            className={`w-9 h-8 flex items-center justify-center rounded-[8px] transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#0071E3] dark:text-[#2997FF]'
                : 'text-[#6E6E73] dark:text-[#A1A1A6]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            className={`w-9 h-8 flex items-center justify-center rounded-[8px] transition-colors ${
              viewMode === 'list'
                ? 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#0071E3] dark:text-[#2997FF]'
                : 'text-[#6E6E73] dark:text-[#A1A1A6]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ActiveFilterList */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={f.clear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0071E3]/10 dark:bg-[#2997FF]/15 text-[#0071E3] dark:text-[#2997FF] text-[12px] font-medium"
            >
              <span>{f.label}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] px-1 py-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ErrorState */}
      {productsError ? (
        <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-[#D70015] dark:text-[#FF453A]" />
          <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Unable to load catalog
          </h2>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">{productsError}</p>
          <button
            type="button"
            onClick={() => void refreshProducts().catch(() => undefined)}
            className="h-[44px] px-5 rounded-[12px] bg-[#0071E3] text-white text-[14px] font-semibold"
          >
            Retry
          </button>
        </div>
      ) : productsLoading ? (
        <p className="py-10 text-center text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
          Loading products...
        </p>
      ) : filteredProducts.length === 0 ? (
        /* EmptyState */
        <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
          <Search className="w-9 h-9 text-[#86868B]" strokeWidth={1.5} />
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              No Apple products match
            </h2>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
              Try adjusting your search or clearing active category filters.
            </p>
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="h-[44px] px-5 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout={viewMode} />
            ))}
          </div>

          {hasMore && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleLimit((n) => n + 6)}
                className="h-[48px] w-full rounded-[12px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors"
              >
                Load More ({filteredProducts.length - visibleProducts.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Filter Bottom Sheet */}
      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filter Apple Products"
      >
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] cursor-pointer">
            <div>
              <div className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Special Savings
              </div>
              <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                Products with promotional MYR pricing
              </div>
            </div>
            <input
              type="checkbox"
              checked={onlyDeals}
              onChange={(e) => setOnlyDeals(e.target.checked)}
              className="w-5 h-5 accent-[#0071E3]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setOnlyDeals(false);
              }}
              className="h-[48px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="h-[48px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
