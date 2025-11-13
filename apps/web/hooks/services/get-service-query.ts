'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';
import type { ServiceResponseDto } from '@scheduler/sdk';

export function useGetServiceQuery(serviceId: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-service', serviceId],
    queryFn: async (): Promise<ServiceResponseDto> => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);
      return api.services.serviceControllerFindById(serviceId);
    },
    enabled: !!serviceId,
  });
}

