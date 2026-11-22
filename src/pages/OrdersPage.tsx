import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Package } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { ResilientImage } from '../components/ui/ResilientImage';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useStore } from '../context/StoreContext';
import type { OrderStatus } from '../types/store';
import { formatMYR, formatShortDate } from '../utils/storage';

const FILTER_TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const OrdersPage: React.FC = () => {
  const { orders, searchQuery, navigate } = useStore();

  const initialTab = useMemo(() => {
    const params = new URLSearchParams(searchQuery);
    const status = params.get('status');
    if (status && FILTER_TABS.some((t) => t.id === status)) {
      return status as 'all' | OrderStatus;
    }
    return 'all';
  }, [searchQuery]);

  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'shipped') {
      return orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery');
    }
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  return (
    <StandaloneShell title="My Orders" backFallback="/profile">
      <div className="flex flex-col">
        {/* OrderFilterTabs */}
        <div
          role="tablist"
          aria-label="Filter orders by status"
          className="bg-white dark:bg-[#1C1C1E] border-b border-[#E8E8ED] dark:border-[#2C2C2E] px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar"
        >
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[36px] px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
                    : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#A1A1A6]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          {filteredOrders.length === 0 ? (
            <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
              <Package className="w-10 h-10 text-[#86868B]" strokeWidth={1.5} />
              <div>
                <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  No orders in this status
                </h2>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
                  Orders you place at Apple The Exchange TRX will appear here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="h-[44px] px-5 rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[13px] font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items[0];
              const totalUnits = order.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <article
                  key={order.id}
                  className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                        {order.orderNumber}
                      </div>
                      <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                        {formatShortDate(order.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {firstItem && (
                    <div className="flex items-center gap-3 py-2 border-y border-[#E8E8ED] dark:border-[#2C2C2E]">
                      <div className="w-14 h-14 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] overflow-hidden shrink-0">
                        <ResilientImage
                          src={firstItem.image}
                          alt={firstItem.name}
                          className="w-full h-full object-contain block"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                          {firstItem.name}
                        </div>
                        <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6] truncate">
                          {firstItem.variantSummary}
                        </div>
                        {order.items.length > 1 && (
                          <div className="text-[11px] font-medium text-[#0071E3] dark:text-[#2997FF] mt-0.5">
                            +{order.items.length - 1} more item
                            {order.items.length - 1 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
                        {totalUnits} {totalUnits === 1 ? 'item' : 'items'} · Total{' '}
                      </span>
                      <span className="text-[14px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                        {formatMYR(order.total)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="min-h-[38px] px-3 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[12px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </StandaloneShell>
  );
};
