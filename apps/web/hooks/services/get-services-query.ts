'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';
import type { ServiceResponseDto } from '@scheduler/sdk';

export function useGetServicesQuery(organizationId?: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-services', organizationId],
    queryFn: async (): Promise<ServiceResponseDto[]> => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);

      const services = await api.services.serviceControllerFindAll(organizationId);
      return services;
    },
  });
}

