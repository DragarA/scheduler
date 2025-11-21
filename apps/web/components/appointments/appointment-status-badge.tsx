import { Badge } from '@/components/ui/badge';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pending', variant: 'outline' },
  CONFIRMED: { label: 'Confirmed', variant: 'default' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  COMPLETED: { label: 'Completed', variant: 'secondary' },
  NO_SHOW: { label: 'No Show', variant: 'destructive' },
};

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
