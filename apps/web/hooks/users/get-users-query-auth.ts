'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';
import type { UserResDto } from '@scheduler/sdk';

export function useGetUsersQueryAuth() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-users-auth'],
    queryFn: async (): Promise<UserResDto[]> => {
      const token = await getToken();
      console.log(token);
      const api = createApiClient(token ?? undefined);

      // Adjust to actual SDK method name
      const users = await api.user.userControllerGetUsersAuth();
      console.log(users);
      return users;
    },
  });
}
