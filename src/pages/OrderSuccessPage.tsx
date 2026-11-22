import React from 'react';
import { CheckCircle2, Copy, Package } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useStore } from '../context/StoreContext';
import { formatDateTime, formatMYR } from '../utils/storage';

export const OrderSuccessPage: React.FC = () => {
  const { orders, lastOrderId, navigate, showToast } = useStore();

  const order = orders.find((o) => o.id === lastOrderId) || orders[0];

  if (!order) {
    return (
      <StandaloneShell title="Order Confirmation" backFallback="/">
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            No recent order found
          </h2>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] text-white text-[14px] font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </StandaloneShell>
    );
  }

  const totalUnits = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      showToast('Order number copied.', 'success');
    } catch {
      showToast(`Order ${order.orderNumber}`, 'info');
    }
  };

  return (
    <StandaloneShell hideHeader>
      <div className="px-4 py-8 flex flex-col gap-5">
        {/* SuccessHeader */}
        <section className="text-center flex flex-col items-center gap-3 pt-2">
          <span className="w-16 h-16 rounded-full bg-[#248A3D]/12 dark:bg-[#30D158]/15 text-[#248A3D] dark:text-[#30D158] flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </span>
          <h1 className="text-[24px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Order Placed
          </h1>
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6] max-w-[320px]">
            Thank you for shopping at Apple The Exchange TRX. Your order reference has been saved.
          </p>
        </section>

        {/* OrderReference */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">Order Number</div>
              <div className="text-[18px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {order.orderNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              aria-label="Copy order number"
              className="h-[40px] px-3 rounded-[10px] border border-[#D2D2D7] dark:border-[#38383A] text-[12px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Placed on {formatDateTime(order.createdAt)}
          </div>
        </section>

        {/* OrderSummary */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Order Summary
            </h2>
            <span className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
              {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="w-16 h-16 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0"
              >
                <ResilientImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain block"
                />
              </div>
            ))}
          </div>

          <div className="pt-2.5 border-t border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-between">
            <span className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6]">
              Order Total (incl. RM 52.00 delivery)
            </span>
            <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(order.total)}
            </span>
          </div>
        </section>

        {/* NextSteps */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex items-start gap-3">
          <Package className="w-5 h-5 text-[#0071E3] dark:text-[#2997FF] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
            <p className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">What happens next</p>
            <p className="mt-1">
              Payment status is currently undecided and pending store confirmation. Track status
              updates anytime under My Orders.
            </p>
          </div>
        </section>

        {/* PrimaryActions */}
        <div className="flex flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold transition-colors"
          >
            View Order Details
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full h-[48px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] text-[14px] font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </StandaloneShell>
  );
};
