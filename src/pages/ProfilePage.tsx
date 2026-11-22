import React, { useState } from 'react';
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  Moon,
  Package,
  Pencil,
  Sun,
  UserRound,
} from 'lucide-react';
import { Modal } from '../components/ui/Overlay';
import { useStore } from '../context/StoreContext';
import { STORE_BRAND } from '../data/catalog';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    orders,
    unreadNotificationCount,
    theme,
    setTheme,
    navigate,
    resetSessionData,
  } = useStore();

  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const countByStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-5">
      {/* ProfileSummary */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="w-14 h-14 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] text-[18px] font-bold flex items-center justify-center shrink-0">
            {profile.avatarInitials}
          </span>
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
              {profile.name}
            </h1>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] truncate">
              {profile.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/profile/account')}
          aria-label="Edit profile"
          className="w-[44px] h-[44px] rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center shrink-0"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </section>

      {/* OrderShortcut */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            My Orders
          </h2>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] inline-flex items-center gap-0.5 min-h-[32px]"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'pending', label: 'Pending', count: countByStatus.pending },
            { id: 'processing', label: 'Processing', count: countByStatus.processing },
            { id: 'shipped', label: 'Shipped', count: countByStatus.shipped },
            { id: 'completed', label: 'Completed', count: countByStatus.completed },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/orders?status=${item.id}`)}
              className="rounded-[12px] bg-[#F5F5F7] dark:bg-[#2C2C2E] py-2.5 px-1.5 flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity"
            >
              <span className="text-[16px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
                {item.count}
              </span>
              <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] truncate max-w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* AccountMenu */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
        {[
          { label: 'My Account', Icon: UserRound, path: '/profile/account' },
          { label: 'My Orders', Icon: Package, path: '/orders' },
          { label: 'My Addresses', Icon: MapPin, path: '/profile/addresses' },
          { label: 'Payment Methods', Icon: CreditCard, path: '/profile/payment-methods' },
        ].map(({ label, Icon, path }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
          >
            <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              <Icon className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
              <span>{label}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#86868B]" />
          </button>
        ))}
      </section>

      {/* SupportMenu */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] overflow-hidden divide-y divide-[#E8E8ED] dark:divide-[#2C2C2E]">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Bell className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>Notifications</span>
          </span>
          <span className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="text-[12px] font-semibold text-[#0071E3] dark:text-[#2997FF] tabular-nums">
                {unreadNotificationCount} unread
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#86868B]" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <HelpCircle className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>Help Center</span>
          </span>
          <ChevronRight className="w-4 h-4 text-[#86868B]" />
        </button>

        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="w-full min-h-[54px] px-4 flex items-center justify-between gap-3 text-left hover:bg-[#F5F5F7]/60 dark:hover:bg-[#2C2C2E]/60 transition-colors"
        >
          <span className="flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Info className="w-5 h-5 text-[#6E6E73] dark:text-[#A1A1A6]" strokeWidth={1.75} />
            <span>About</span>
          </span>
          <ChevronRight className="w-4 h-4 text-[#86868B]" />
        </button>
      </section>

      {/* SettingsSection */}
      <section className="rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#2C2C2E] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Appearance
            </div>
            <div className="text-[12px] text-[#6E6E73] dark:text-[#A1A1A6]">
              Light or Dark storefront theme
            </div>
          </div>

          <div
            role="group"
            aria-label="Theme selector"
            className="flex items-center gap-1 p-1 rounded-[10px] bg-[#F5F5F7] dark:bg-[#2C2C2E]"
          >
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              className={`h-[34px] px-3 rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                theme === 'light'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`h-[34px] px-3 rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1C1C1E] text-[#F5F5F7] shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSignOutOpen(true)}
          className="mt-1 w-full h-[46px] rounded-[12px] border border-[#D70015]/30 dark:border-[#FF453A]/30 text-[#D70015] dark:text-[#FF453A] text-[14px] font-semibold inline-flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </section>

      {/* Help Center Modal */}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help Center">
        <div className="flex flex-col gap-3 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Shipping & Delivery
            </h4>
            <p className="mt-0.5">
              All orders carry a fixed RM 52.00 insured courier shipping fee across Malaysia.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Returns & Warranty
            </h4>
            <p className="mt-0.5">
              Every Apple product includes 1-year Apple Limited Warranty and 14-day return support.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHelpOpen(false);
              navigate('/livechat');
            }}
            className="mt-2 h-[46px] rounded-[12px] bg-[#0071E3] dark:bg-[#2997FF] text-white text-[14px] font-semibold"
          >
            Chat with a Specialist
          </button>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="Apple The Exchange TRX">
        <div className="flex flex-col gap-3 text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">
          <p className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
            Official mobile storefront for Apple The Exchange TRX in Kuala Lumpur, Malaysia.
          </p>
          <p>{STORE_BRAND.address}</p>
          <p>Opening Hours: {STORE_BRAND.hours}</p>
          <p>Contact: {STORE_BRAND.phone}</p>
        </div>
      </Modal>

      {/* Sign Out / Reset Confirmation */}
      <Modal open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Reset Store Session?">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#6E6E73] dark:text-[#A1A1A6]">
            Signing out will reset your shopping bag, saved addresses, and local order history back to
            the initial store state.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSignOutOpen(false)}
              className="h-[46px] rounded-[12px] border border-[#D2D2D7] dark:border-[#38383A] text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetSessionData();
                setSignOutOpen(false);
              }}
              className="h-[46px] rounded-[12px] bg-[#D70015] dark:bg-[#FF453A] text-white text-[14px] font-semibold"
            >
              Reset & Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
