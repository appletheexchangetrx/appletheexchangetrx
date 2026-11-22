import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useStore } from '../context/StoreContext';
import { formatMYR } from '../utils/storage';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    selectedCartItems,
    cartSubtotal,
    updateCartQuantity,
    toggleCartItemSelect,
    toggleSelectAllCart,
    removeCartItem,
    removeSelectedCartItems,
    clearBuyNow,
    navigate,
  } = useStore();

  const allSelected = cart.length > 0 && cart.every((i) => i.selected);
  const selectedTotalUnits = selectedCartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    clearBuyNow();
    navigate('/checkout');
  };

  return (
    <StandaloneShell
      title="Shopping Bag"
      backFallback="/products"
      headerRight={
        <span className="text-[12px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums pr-2">
          {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </span>
      }
      bottomAction={
        cart.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">
                Selected ({selectedTotalUnits} {selectedTotalUnits === 1 ? 'item' : 'items'})
              </span>
              <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(cartSubtotal)}
              </span>
            </div>
            <button
              type="button"
              disabled={selectedCartItems.length === 0}
              onClick={handleCheckout}
              className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold disabled:opacity-40 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : undefined
      }
    >
      {cart.length === 0 ? (
        <div className="px-6 py-16 text-center flex flex-col items-center gap-4">
          <span className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-center text-[#86868B]">
            <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Your bag is empty
            </h2>
            <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
              Explore iPhone, Mac, iPad, Apple Watch, and AirPods from Apple The Exchange TRX.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* CartSelectionBar */}
          <div className="rounded-[14px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] px-3.5 py-2.5 flex items-center justify-between">
            <label className="flex items-center gap-2.5 min-h-[36px] cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleSelectAllCart(e.target.checked)}
                className="w-5 h-5 rounded accent-[#0071E3]"
              />
              <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Select All ({cart.length})
              </span>
            </label>

            {selectedCartItems.length > 0 && (
              <button
                type="button"
                onClick={removeSelectedCartItems}
                className="min-h-[36px] px-2 text-[12px] font-semibold text-[#D70015] dark:text-[#FF453A]"
              >
                Remove Selected
              </button>
            )}
          </div>

          {/* CartItemList */}
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.key}
                className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-3.5 flex gap-3"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleCartItemSelect(item.key)}
                    aria-label={`Select ${item.name}`}
                    className="w-5 h-5 rounded accent-[#0071E3]"
                  />
                </div>

                <a
                  href={`/product/${item.productId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/product/${item.productId}`);
                  }}
                  className="w-[88px] h-[88px] rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0 block"
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    fallbackTitle={item.name}
                    className="w-full h-full object-contain block"
                  />
                </a>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <a
                        href={`/product/${item.productId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/product/${item.productId}`);
                        }}
                        className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-snug line-clamp-2"
                      >
                        {item.name}
                      </a>
                      <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5 truncate">
                        {item.variantSummary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="w-8 h-8 -mt-1 -mr-1 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#D70015] dark:hover:text-[#FF453A]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                      {formatMYR(item.price * item.quantity)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={item.quantity <= 1}
                        onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                        className="w-[32px] h-[32px] rounded-[8px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                        className="w-[32px] h-[32px] rounded-[8px] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-35"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CartSummary */}
          <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Subtotal</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(cartSubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Discount</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(0)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Bag Total
              </span>
              <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {formatMYR(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-[#86868B]">
              Fixed RM 52.00 insured delivery fee is calculated at checkout.
            </p>
          </div>
        </div>
      )}
    </StandaloneShell>
  );
};
