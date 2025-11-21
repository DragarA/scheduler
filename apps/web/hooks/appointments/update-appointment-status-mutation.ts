'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';
import type { UpdateAppointmentStatusDtoClass } from '@scheduler/sdk';

export function useUpdateAppointmentStatusMutation(appointmentId: number) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAppointmentStatusDtoClass) => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);
      return api.appointments.appointmentControllerUpdateStatus(appointmentId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['get-appointment', appointmentId] });
    },
  });
}
