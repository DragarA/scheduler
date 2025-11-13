'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';

export function useDeleteServiceMutation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: number) => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);
      return api.services.serviceControllerSoftDelete(serviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-services'] });
    },
  });
}

