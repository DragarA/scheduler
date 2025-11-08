'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@/lib/api-client';

export function useGetUsersQuery() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['get-users'],
    queryFn: async () => {
      const token = await getToken();
      const api = createApiClient(token ?? undefined);

      // Adjust to actual SDK method name
      const users = await api.user.userControllerGetUsers();
      return users;
    },
  });
}
