import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-3 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[468px] px-4 flex flex-col gap-2"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-4 h-4 text-[#248A3D] dark:text-[#30D158] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#D70015] dark:text-[#FF453A] shrink-0" />,
          warning: <TriangleAlert className="w-4 h-4 text-[#B7791F] dark:text-[#FFD60A] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md border border-[#D2D2D7] dark:border-[#38383A] px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[toast.variant]}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[440px] rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E8E8ED] dark:border-[#38383A] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8ED] dark:border-[#2C2C2E]">
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-xl text-[#6E6E73] dark:text-[#A1A1A6] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[75dvh] overflow-y-auto scroll-container">{children}</div>
      </div>
    </div>
  );
};

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[500px] rounded-t-[20px] bg-white dark:bg-[#1C1C1E] border-t border-[#E8E8ED] dark:border-[#38383A] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] safe-area-bottom">
        <div className="pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-[#D2D2D7] dark:bg-[#38383A]" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E8ED] dark:border-[#2C2C2E]">
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-xl text-[#6E6E73] dark:text-[#A1A1A6] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[70dvh] overflow-y-auto scroll-container">{children}</div>
      </div>
    </div>
  );
};
