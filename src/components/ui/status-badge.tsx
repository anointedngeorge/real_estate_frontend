import { cn } from "@/lib/utils";
import type { PaymentStatus, PropertyStatus } from "@/types";

type StatusType = PaymentStatus | PropertyStatus | 'active' | 'inactive' | 'suspended' | 'pending' | 'approved' | 'paid' | 'completed' | 'in_progress' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: string }> = {
  // Payment Status
  paid: { label: 'Paid', variant: 'status-badge--success' },
  due: { label: 'Due', variant: 'status-badge--warning' },
  overdue: { label: 'Overdue', variant: 'status-badge--error' },

  // Property Status
  available: { label: 'Available', variant: 'status-badge--success' },
  sold: { label: 'Sold', variant: 'status-badge--info' },
  reserved: { label: 'Reserved', variant: 'status-badge--warning' },
  archived: { label: 'Archived', variant: 'status-badge--neutral' },

  // User Status
  active: { label: 'Active', variant: 'status-badge--success' },
  inactive: { label: 'Inactive', variant: 'status-badge--neutral' },
  suspended: { label: 'Suspended', variant: 'status-badge--error' },

  // Commission Status
  pending: { label: 'Pending', variant: 'status-badge--warning' },
  approved: { label: 'Approved', variant: 'status-badge--info' },

  // Sale Status
  completed: { label: 'Completed', variant: 'status-badge--success' },
  in_progress: { label: 'In Progress', variant: 'status-badge--info' },
  cancelled: { label: 'Cancelled', variant: 'status-badge--error' },

};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'status-badge--neutral' };
  
  return (
    <span className={cn("status-badge", config.variant, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
  
}
