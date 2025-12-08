import { hc } from 'hono/client';
import type { AppType } from '$lib/server/api';
import { env } from '$env/dynamic/public';

// Create the type-safe Hono RPC client
// In browser, use relative URL; in SSR, use configured URL or fallback
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // For SSR, use PUBLIC_API_URL if set, otherwise fallback to localhost
  return env.PUBLIC_API_URL || 'http://localhost:5173';
};

export const createApiClient = (baseUrl?: string) => {
  return hc<AppType>(baseUrl ?? getBaseUrl());
};

// Default client instance
export const api = createApiClient();
