import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from 'lucide-react';
import type { OrderStatus } from '../../types/store';

interface StatusBadgeProps {
  status: OrderStatus;
}

const STATUS_META: Record<
  OrderStatus,
  { label: string; colorClass: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: 'Pending',
    colorClass: 'text-[#B7791F] dark:text-[#FFD60A] bg-[#B7791F]/10 dark:bg-[#FFD60A]/15',
    Icon: Clock,
  },
  processing: {
    label: 'Processing',
    colorClass: 'text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15',
    Icon: PackageCheck,
  },
  shipped: {
    label: 'Shipped',
    colorClass: 'text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15',
    Icon: Truck,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    colorClass: 'text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15',
    Icon: Truck,
  },
  completed: {
    label: 'Completed',
    colorClass: 'text-[#248A3D] dark:text-[#30D158] bg-[#248A3D]/10 dark:bg-[#30D158]/15',
    Icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    colorClass: 'text-[#D70015] dark:text-[#FF453A] bg-[#D70015]/10 dark:bg-[#FF453A]/15',
    Icon: XCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const meta = STATUS_META[status];
  const Icon = meta.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${meta.colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{meta.label}</span>
    </span>
  );
};
