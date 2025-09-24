import { createSSEStream } from '../../../../src/utils/streamUtils';
import { RoadmapStreamInput } from '../../../../src/mastra/workflows/roadmapWorkflowSchemas';
import { jwtVerify } from 'jose';

interface JwtClaims {
  [key: string]: unknown;
  sub: string;
  roles: string[];
}

async function verifyJwt(token: string): Promise<JwtClaims | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret');
    const { payload } = await jwtVerify(token, secret as unknown as CryptoKey | Uint8Array);
    return payload as JwtClaims;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = RoadmapStreamInput.safeParse({
      userId: body.userId ?? null,
      roles: body.roles ?? [],
      prompt: body.prompt ?? '',
      threadId: body.threadId,
    });

    if (parsed.success === false) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: parsed.error.format() }), { status: 400 });
    }

    if (typeof body.jwt === 'string' && Boolean(body.jwt)) {
      const claims = await verifyJwt(body.jwt);
      if (!claims) {
        return new Response(JSON.stringify({ error: 'Invalid JWT' }), { status: 401 });
      }
      parsed.data.userId = parsed.data.userId ?? (claims.sub);
      parsed.data.roles = (Array.isArray(parsed.data.roles) && parsed.data.roles.length > 0) ? parsed.data.roles : (claims.roles) ?? [];
    }

    // Bridge Mastra streaming into SSE format
    return createSSEStream(async (controller) => {
      // TODO: call Mastra workflow with streaming enabled and forward events using streamJSONEvent
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'mastra_event', eventType: 'connected' })}\n\n`));
      // Simulate a short welcome chunk
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'mastra_event', eventType: 'message', payload: { text: 'stream started' } })}\n\n`));
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
