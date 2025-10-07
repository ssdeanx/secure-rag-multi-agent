import { MastraClient } from "@mastra/client-js";

// Return the configured Mastra base URL. Prefer env var, fall back to localhost for dev.
export function getMastraBaseUrl(): string {
  // prefer an explicit env var; allow http in local dev so local dev with no TLS works
  return process.env.NEXT_PUBLIC_MASTRA_URL ?? 'http://localhost:4111';
}

// only include Authorization when a service-level NEXT_PUBLIC_MASTRA_API_KEY exists in the environment
const serviceHeaders: Record<string,string> = {};
if (process.env.NEXT_PUBLIC_MASTRA_API_KEY) {
  serviceHeaders.Authorization = `Bearer ${process.env.NEXT_PUBLIC_MASTRA_API_KEY}`;
}

export const mastraClient = new MastraClient({
  baseUrl: getMastraBaseUrl(),
  headers: serviceHeaders,
});

/**
 * Factory to create a MastraClient for a specific user token (use in API routes).
 * Keep this file as the canonical Mastra auth surface for the repo.
 */
export function createMastraClient(token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return new MastraClient({
    baseUrl: getMastraBaseUrl(),
    headers,
  });
}
