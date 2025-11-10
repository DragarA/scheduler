import type { ApiError } from '@scheduler/sdk'; // adjust if not re-exported

export type NormalizedError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
};

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'url' in error
  );
}

export function normalizeError(error: unknown): NormalizedError {
  if (isApiError(error)) {
    // openapi-typescript-codegen ApiError usually has: status, body, message, url
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = error as any;
    return {
      message:
        anyErr.body?.message ||
        anyErr.message ||
        `Request failed with status ${anyErr.status}`,
      status: anyErr.status,
      code: anyErr.body?.code,
      details: anyErr.body,
      cause: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'Something went wrong',
      cause: error,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'Unknown error',
    cause: error,
  };
}
