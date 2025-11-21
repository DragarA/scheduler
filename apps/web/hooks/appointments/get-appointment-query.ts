'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';

export function useGetAppointmentQuery(id: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-appointment', id],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);

      const appointment = await api.appointments.appointmentControllerFindById(id);
      return appointment;
    },
    enabled: !!id,
  });
}
