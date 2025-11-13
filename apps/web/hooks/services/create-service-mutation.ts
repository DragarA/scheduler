'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import type { ServiceFormData } from '@/components/services/service-form';

export function useCreateServiceMutation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);
      return api.services.serviceControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-services'] });
      router.push('/dashboard/services');
    },
  });
}

