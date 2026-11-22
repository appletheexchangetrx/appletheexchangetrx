import React from 'react';
import { Bell, House, LayoutGrid, MessageCircle, ShoppingBag, UserRound } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppleLogoMark: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = 'w-6 h-6',
  inverted = false,
}) => (
  <img
    src="/assets/aistudio/logo__1__c21fc43e.png"
    alt="Apple The Exchange TRX"
    draggable={false}
    className={`object-contain select-none pointer-events-none ${
      inverted ? 'invert dark:invert-0' : 'dark:invert'
    } ${className}`}
  />
);

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { pathname, navigate, cartCount, unreadNotificationCount } = useStore();

  const navItems = [
    { id: 'home', label: 'Home', path: '/', Icon: House },
    { id: 'products', label: 'Products', path: '/products', Icon: LayoutGrid },
    { id: 'livechat', label: 'Live Chat', path: '/livechat', Icon: MessageCircle },
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
          <AppleLogoMark className="w-6 h-6 shrink-0" />
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
        <div className="h-[64px] grid grid-cols-3 items-center px-1">
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
