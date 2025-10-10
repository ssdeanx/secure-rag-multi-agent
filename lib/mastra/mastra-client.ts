import { MastraClient } from "@mastra/client-js";

export function getMastraBaseUrl(): string {
  return process.env.MASTRA_URL ?? process.env.NEXT_PUBLIC_MASTRA_URL ?? "http://localhost:4111";
}

export async function createAuthenticatedMastraClient(): Promise<MastraClient | null> {
  const response = await fetch('/api/auth/session');
  const data: { session?: { access_token?: string } } = await response.json();

  const accessToken = data.session?.access_token ?? '';
  if (accessToken === '') {
    return null;
  }

  return new MastraClient({
    baseUrl: getMastraBaseUrl(),
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export const mastraClient = new MastraClient({
  baseUrl: getMastraBaseUrl(),
});

