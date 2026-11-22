import React from 'react';
import { Bell, House, LayoutGrid, MessageCircle, ShoppingBag, UserRound } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppleLogoMark: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3z" />
  </svg>
);

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { pathname, navigate, cartCount, unreadNotificationCount } = useStore();

  const navItems = [
    { id: 'home', label: 'Home', path: '/', Icon: House },
    { id: 'products', label: 'Products', path: '/products', Icon: LayoutGrid },
    { id: 'livechat', label: 'Live Chat', path: '/livechat', Icon: MessageCircle },
    { id: 'profile', label: 'Profile', path: '/profile', Icon: UserRound },
  ];

  const isNavActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="h-[100dvh] w-full max-w-[500px] mx-auto flex flex-col overflow-hidden bg-[#F5F5F7] dark:bg-[#000000] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      {/* GlobalHeader: 56px static */}
      <header className="flex-none h-[56px] safe-area-top bg-white dark:bg-[#1C1C1E] border-b border-[#E8E8ED] dark:border-[#2C2C2E] px-4 flex items-center justify-between gap-2 z-20">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 min-h-[44px] pr-2 text-left text-[#1D1D1F] dark:text-[#F5F5F7] focus-visible:outline-2 focus-visible:outline-[#0071E3] rounded-lg min-w-0"
          aria-label="Apple The Exchange TRX Home"
        >
          <AppleLogoMark className="w-5 h-5 shrink-0" />
          <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap truncate">
            Apple The Exchange TRX
          </span>
        </button>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label={`Notifications${unreadNotificationCount > 0 ? `, ${unreadNotificationCount} unread` : ''}`}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors"
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#D70015] dark:bg-[#FF453A] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#0071E3] dark:bg-[#2997FF] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors"
          >
            <UserRound className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* MainContent: flex-1, min-h-0, scrollable */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-container">
        {children}
      </main>

      {/* BottomNavigation: 64px static */}
      <nav
        aria-label="Primary navigation"
        className="flex-none bg-white dark:bg-[#1C1C1E] border-t border-[#E8E8ED] dark:border-[#2C2C2E] safe-area-bottom z-30"
      >
        <div className="h-[64px] grid grid-cols-4 items-center px-1">
          {navItems.map(({ id, label, path, Icon }) => {
            const active = isNavActive(path);
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(path)}
                aria-current={active ? 'page' : undefined}
                className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? 'text-[#0071E3] dark:text-[#2997FF]'
                    : 'text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
                }`}
              >
                <Icon className="w-[21px] h-[21px]" strokeWidth={active ? 2.2 : 1.75} />
                <span className="text-[11px] font-medium whitespace-nowrap leading-none">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
