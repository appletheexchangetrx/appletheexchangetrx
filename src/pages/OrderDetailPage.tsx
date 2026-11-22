import React, { useState } from 'react';
import { Check, Copy, MapPin, MessageCircle, MoreHorizontal } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { BottomSheet, Modal } from '../components/ui/Overlay';
import { ResilientImage } from '../components/ui/ResilientImage';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useStore } from '../context/StoreContext';
import { formatDateTime, formatMYR } from '../utils/storage';

interface OrderDetailPageProps {
  orderId: string;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId }) => {
  const { orders, navigate, cancelOrder, buyAgainOrder, showToast } = useStore();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <StandaloneShell title="Order Details" backFallback="/orders">
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-[18px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Order not found
          </h2>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="h-[48px] px-6 rounded-[12px] bg-[#0071E3] text-white text-[14px] font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </StandaloneShell>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'processing';

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      showToast('Order number copied.', 'success');
    } catch {
      showToast(`Order ${order.orderNumber}`, 'info');
    }
  };

  return (
    <StandaloneShell
      title="Order Details"
      backFallback="/orders"
      headerRight={
        <button
          type="button"
          onClick={() => setActionsOpen(true)}
          aria-label="More order actions"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
    >
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* OrderStatusSection */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={order.status} />
            <span className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
              Updated {formatDateTime(order.updatedAt)}
            </span>
          </div>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
            {order.status === 'cancelled'
              ? 'This order has been cancelled.'
              : 'Your Apple hardware order is managed by Apple The Exchange TRX.'}
          </p>
        </section>

        {/* OrderTrackingTimeline */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-3.5">
            Tracking Timeline
          </h2>
          <div className="flex flex-col">
            {order.trackingTimeline.map((step, idx) => {
              const isLast = idx === order.trackingTimeline.length - 1;
              return (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed
                          ? 'bg-[#0071E3] dark:bg-[#2997FF] text-white'
                          : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    {!isLast && (
                      <div
                        className={`w-[2px] flex-1 min-h-[24px] my-1 ${
                          step.completed
                            ? 'bg-[#0071E3]/40 dark:bg-[#2997FF]/40'
                            : 'bg-[#E8E8ED] dark:bg-[#2C2C2E]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[13px] font-semibold ${
                          step.completed
                            ? 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                            : 'text-[#86868B]'
                        }`}
                      >
                        {step.label}
                      </span>
                      {step.timestamp && (
                        <span className="text-[11px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums">
                          {formatDateTime(step.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* OrderInformation */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Order Information
          </h2>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Order Number</span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums"
            >
              <span>{order.orderNumber}</span>
              <Copy className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Order Date</span>
            <span className="text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Payment Status</span>
            <span className="font-medium text-[#B7791F] dark:text-[#FFD60A]">
              Pending (Undecided)
            </span>
          </div>
        </section>

        {/* ShippingAddressSection */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
            <span>Shipping Address</span>
          </h2>
          <p className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            {order.shippingAddress.recipientName}
          </p>
          <p className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] mt-0.5 tabular-nums">
            {order.shippingAddress.phone}
          </p>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1 leading-relaxed">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},{' '}
            {order.shippingAddress.postcode} {order.shippingAddress.city},{' '}
            {order.shippingAddress.state}
          </p>
        </section>

        {/* OrderItemsSection */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
            Items ({order.items.length})
          </h2>
          <div className="divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="py-3 first:pt-0 last:pb-0 flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain block"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                    {item.variantSummary}
                  </div>
                  <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] tabular-nums mt-0.5">
                    {formatMYR(item.unitPrice)} × {item.quantity}
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums shrink-0">
                  {formatMYR(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PaymentSummary */}
        <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-2">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
            Payment Summary
          </h2>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Subtotal</span>
            <span className="text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(order.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Shipping Fee</span>
            <span className="text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(order.shippingFee)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6]">Discount</span>
            <span className="text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(order.discount)}
            </span>
          </div>
          <div className="pt-2 border-t border-[#E8E8ED] dark:border-[#2C2C2E] flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Total
            </span>
            <span className="text-[17px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
              {formatMYR(order.total)}
            </span>
          </div>
        </section>

        {/* OrderActions */}
        <section className="flex flex-col gap-2.5 pb-2">
          <button
            type="button"
            onClick={() => buyAgainOrder(order)}
            className="w-full h-[48px] rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#47A7FF] text-white text-[14px] font-semibold"
          >
            Buy Again
          </button>
          <button
            type="button"
            onClick={() => navigate('/livechat')}
            className="w-full h-[48px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] text-[14px] font-semibold inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelConfirmOpen(true)}
              className="w-full h-[48px] rounded-[12px] border border-[#D70015]/30 dark:border-[#FF453A]/30 text-[#D70015] dark:text-[#FF453A] text-[14px] font-semibold"
            >
              Cancel Order
            </button>
          )}
        </section>
      </div>

      <BottomSheet
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title="Order Options"
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setActionsOpen(false);
              handleCopyOrderNumber();
            }}
            className="w-full h-[48px] px-4 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] text-left text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            Copy Order Number ({order.orderNumber})
          </button>
          <button
            type="button"
            onClick={() => {
              setActionsOpen(false);
              navigate('/livechat');
            }}
            className="w-full h-[48px] px-4 rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] text-left text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            Ask a TRX Specialist
          </button>
          {canCancel && (
            <button
              type="button"
              onClick={() => {
                setActionsOpen(false);
                setCancelConfirmOpen(true);
              }}
              className="w-full h-[48px] px-4 rounded-[12px] bg-[#D70015]/10 dark:bg-[#FF453A]/15 text-left text-[14px] font-semibold text-[#D70015] dark:text-[#FF453A]"
            >
              Cancel Order
            </button>
          )}
        </div>
      </BottomSheet>

      <Modal
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        title="Cancel Order?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Are you sure you want to cancel order{' '}
            <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {order.orderNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCancelConfirmOpen(false)}
              className="h-[48px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={() => {
                cancelOrder(order.id);
                setCancelConfirmOpen(false);
              }}
              className="h-[48px] rounded-[12px] bg-[#D70015] dark:bg-[#FF453A] text-white text-[14px] font-semibold"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </StandaloneShell>
  );
};
