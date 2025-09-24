import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { createMastraClient } from '../../../lib/mastra/mastra-client';
import { RoadmapSyncInput } from '../../../src/mastra/workflows/roadmapWorkflowSchemas';

interface JwtClaims {
  [key: string]: unknown;
  sub: string;
  roles: string[];
}

async function verifyJwt(token: string): Promise<JwtClaims | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret');
    const { payload } = await jwtVerify<JwtClaims>(token, secret);
    return payload as JwtClaims;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = RoadmapSyncInput.safeParse({
      userId: body.userId ?? null,
      roles: body.roles ?? [],
      canvasState: body.canvasState ?? body.canvas ?? {},
      threadId: body.threadId,
    });

    let claims: JwtClaims | null = null;
    // If the client sent a JWT, verify it first
    if (typeof body.jwt === 'string' && Boolean(body.jwt)) {
      claims = await verifyJwt(body.jwt);
      if (!claims) {
        return new Response(JSON.stringify({ error: 'Invalid JWT' }), { status: 401 });
      }
    }

    if (parsed.success === false) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: parsed.error.format() }), { status: 400 });
    }

    // Now safely mutate parsed.data with verified claims when available
    if (claims) {
      parsed.data.userId = parsed.data.userId ?? (claims.sub);
      const roles = claims.roles as string[] | undefined;
      parsed.data.roles = roles ?? [];
      parsed.data.roles = (Array.isArray(parsed.data.roles) && parsed.data.roles.length > 0) ? parsed.data.roles : roles ?? [];
    }

    // TODO: Wire to Mastra client and start productRoadmap workflow
    // const client = createMastraClient(body.jwt);
    // const run = await client.executeWorkflow('productRoadmap', { input: parsed.data });

    return new Response(JSON.stringify({ status: 'ok', workflowId: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
