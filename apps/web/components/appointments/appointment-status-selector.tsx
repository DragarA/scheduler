'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUpdateAppointmentStatusMutation } from '@/hooks/appointments/update-appointment-status-mutation';
import { AppointmentStatus } from './appointment-status-badge';
import { UpdateAppointmentStatusDtoClass } from '@scheduler/sdk';

interface AppointmentStatusSelectorProps {
  appointmentId: number;
  currentStatus: AppointmentStatus;
}

const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED', 'NO_SHOW'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
};

export function AppointmentStatusSelector({
  appointmentId,
  currentStatus,
}: AppointmentStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState<UpdateAppointmentStatusDtoClass.status | null>(null);
  const updateStatusMutation = useUpdateAppointmentStatusMutation(appointmentId);

  const allowedStatuses = allowedTransitions[currentStatus];
  const canTransition = allowedStatuses.length > 0;

  const handleUpdate = async () => {
    if (!selectedStatus) return;

    try {
      await updateStatusMutation.mutateAsync({ status: selectedStatus });
      setSelectedStatus(null);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  if (!canTransition) {
    return (
      <div className="text-sm text-muted-foreground">
        No status changes allowed from {statusLabels[currentStatus]}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedStatus ?? undefined}
        onValueChange={(value) => setSelectedStatus(value as UpdateAppointmentStatusDtoClass.status)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Change status..." />
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {statusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={!selectedStatus || updateStatusMutation.isPending}
      >
        {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
      </Button>
    </div>
  );
}
