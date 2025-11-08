'use client'
import { useGetUsersQueryAuth } from '@/hooks/users/get-users-query-auth';
export default function Test() {
  const { data, isLoading, error } = useGetUsersQueryAuth();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  return <div>
    <h1>Users</h1>
    <ul>
      {data.map((user) => (
        <li key={user.id}>{JSON.stringify(user)}</li>
      ))}
    </ul>
  </div>;
}