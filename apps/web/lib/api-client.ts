import { SchedulerApiClient, OpenAPIConfig } from '@scheduler/sdk';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export function createApiClient(token?: string | null) {
  const config: OpenAPIConfig = {
    BASE: BASE_URL,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: token
      ? async () => token      // openapi-typescript-codegen supports TOKEN as string | () => string | Promise<string>
      : undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
  };

  return new SchedulerApiClient(config);
}
