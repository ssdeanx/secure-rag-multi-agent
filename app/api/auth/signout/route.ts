import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // If you use cookies/sessions on server, clear them here. For now just return OK.
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
