import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StandaloneShellProps {
  title?: string;
  backFallback?: string;
  headerRight?: React.ReactNode;
  customHeader?: React.ReactNode;
  hideHeader?: boolean;
  bottomAction?: React.ReactNode;
  children: React.ReactNode;
}

export const StandaloneShell: React.FC<StandaloneShellProps> = ({
  title,
  backFallback = '/',
  headerRight,
  customHeader,
  hideHeader = false,
  bottomAction,
  children,
}) => {
  const { goBack } = useStore();

  return (
    <div className="h-[100dvh] w-full max-w-[500px] mx-auto flex flex-col overflow-hidden bg-[#F5F5F7] dark:bg-[#000000] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      {!hideHeader && (
        <header className="flex-none safe-area-top bg-white dark:bg-[#1C1C1E] border-b border-[#E8E8ED] dark:border-[#2C2C2E] z-20">
          {customHeader ? (
            customHeader
          ) : (
            <div className="h-[56px] px-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goBack(backFallback)}
                aria-label="Go back"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors shrink-0"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.8} />
              </button>
              <h1 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate text-center flex-1">
                {title}
              </h1>
              <div className="min-w-[44px] flex items-center justify-end shrink-0 pr-1">
                {headerRight}
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-container">
        {children}
      </main>

      {bottomAction && (
        <div className="flex-none bg-white dark:bg-[#1C1C1E] border-t border-[#E8E8ED] dark:border-[#2C2C2E] px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] z-40">
          {bottomAction}
        </div>
      )}
    </div>
  );
};
