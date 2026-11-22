import React, { useMemo, useState } from 'react';
import { Bell, ChevronRight, Package, Store, Tag } from 'lucide-react';
import { StandaloneShell } from '../components/layout/StandaloneShell';
import { useStore } from '../context/StoreContext';
import { formatDateTime } from '../utils/storage';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <StandaloneShell
      title="Notifications"
      backFallback="/"
      headerRight={
        unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] px-2 min-h-[36px] whitespace-nowrap"
          >
            Mark all read
          </button>
        ) : null
      }
    >
      <div className="flex flex-col">
        {/* NotificationFilter */}
        <div className="bg-white dark:bg-[#1C1C1E] border-b border-[#E8E8ED] dark:border-[#2C2C2E] px-4 py-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`min-h-[36px] px-4 rounded-full text-[13px] font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
                : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#A1A1A6]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`min-h-[36px] px-4 rounded-full text-[13px] font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
                : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#A1A1A6]'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-8 text-center flex flex-col items-center gap-3">
              <Bell className="w-9 h-9 text-[#86868B]" strokeWidth={1.5} />
              <div>
                <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  You are all caught up
                </h2>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
                  Order updates and Apple The Exchange TRX announcements will appear here.
                </p>
              </div>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon =
                item.type === 'order' ? Package : item.type === 'promo' ? Tag : Store;
              return (
                <div
                  key={item.id}
                  className={`rounded-[16px] border p-4 flex items-start gap-3 transition-colors ${
                    item.read
                      ? 'bg-white dark:bg-[#1C1C1E] border-[#E8E8ED] dark:border-[#2C2C2E]'
                      : 'bg-white dark:bg-[#1C1C1E] border-[#0071E3]/40 dark:border-[#2997FF]/40'
                  }`}
                >
                  <span className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="text-[11px] font-semibold text-[#0071E3] dark:text-[#2997FF] shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#86868B]">
                        {formatDateTime(item.timestamp)}
                      </span>
                      {item.actionPath && (
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(item.id);
                            navigate(item.actionPath!);
                          }}
                          className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 min-h-[32px]"
                        >
                          <span>{item.actionLabel || 'View'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </StandaloneShell>
  );
};
