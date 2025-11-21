'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';

export interface AppointmentsQueryParams {
  search?: string;
  status?: Array<'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'>;
  sortBy?: 'start' | 'customer' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function useGetAppointmentsQuery(params?: AppointmentsQueryParams) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-appointments', params],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);

      const result = await api.appointments.appointmentControllerFindAll(
        params?.search,
        params?.sortBy,
        params?.sortOrder,
        params?.page,
        params?.limit,
        params?.status
      );
      return result;
    },
    placeholderData: keepPreviousData,
  });
}
