import type { NextRequest } from 'next/server';
import { getMastraBaseUrl } from '../../../../lib/mastra/mastra-client';

function findToken(obj: any) {
  if (!obj) { return null; }
  return obj.token || obj.jwt || obj.accessToken || obj.data?.token || obj.data?.accessToken || null;
}

/**
 * POST /api/auth/login
 * Proxies login to the Mastra auth endpoint and sets an HttpOnly cookie when a token
 * is returned. This route must remain server-only and must not leak tokens to client JS.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const url = `${getMastraBaseUrl()}/auth/login`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    // Network/connection error talking to Mastra backend
    return new Response(JSON.stringify({ error: 'Failed to reach auth server' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }

  // attempt to parse JSON, but fall back to text for non-JSON responses
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    data = { message: await res.text() };
  }

  const token = findToken(data);

  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) {
    // Set HttpOnly cookie. Use Max-Age to avoid timezone issues.
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    const encoded = encodeURIComponent(token);
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookie = `mastra_jwt=${encoded}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secureFlag}`;
    headers['Set-Cookie'] = cookie;
  }

  return new Response(JSON.stringify(data), { status: res.status, headers });
}
