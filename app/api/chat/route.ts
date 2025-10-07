

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jwtVerify } from 'jose';

// Configure timeout config
const STATUS_VALUE = 400;
export const maxDuration = 60; // 60 seconds for chat responses
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const schema = z.object({
      jwt: z.string().min(1, 'JWT token is required'),
      question: z.string().min(1, 'Question is required')
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: STATUS_VALUE }
      );
    }
    const { jwt, question } = parsed.data;

    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret');
    try {
      const { payload } = await jwtVerify(jwt, secret);
      // Basic role/tenant check (extend with RoleService if needed)
      interface JwtClaims {
        [claim: string]: unknown;
        roles?: string[] | string;
        tenant?: string;
        sub?: string;
      }
      const rawPayload = payload as unknown as JwtClaims;
      const rawRoles = rawPayload.roles;
      const roles: string[] = Array.isArray(rawRoles)
        ? rawRoles.map(String)
        : typeof rawRoles === 'string'
        ? [rawRoles]
        : [];
      // Normalize tenant explicitly to avoid nullable string checks in conditionals
      const tenantRaw = rawPayload.tenant;
      const tenant = typeof tenantRaw === 'string' ? tenantRaw.trim() : '';
      if (roles.length === 0 || tenant === '') {
        return NextResponse.json(
          { error: 'Invalid user claims' },
          { status: 401 }
        );
      }
      console.log(`Verified user: ${rawPayload.sub ?? 'unknown'} with roles ${roles.join(', ')} in tenant ${tenant}`);
    } catch (verifyError) {
      console.error('JWT verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const encoder: TextEncoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: 'Processing your request...\n\n' })}\n\n`)
          );

          console.log(`Processing question: ${question}`);
          const startTime = Date.now();

          // Get workflow from mastra and use createRunAsync
          // cannot import mastra at like this in a route file
          const workflow = mastra.getWorkflows()['governed-rag-answer'];
          const run = await workflow.createRunAsync();

          const result = await run.start({
            inputData: { jwt, question }
          });

          const duration: number = (Date.now() - startTime) / 1000;
          console.log(`Workflow completed in ${duration}s`);

          if (result.status === 'success') {
            const { answer, citations } = result.result;

            // Stream the answer in chunks
            const chunks = answer.match(/.{1,50}/g) ?? [answer];
            for (const chunk of chunks) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
              );
              await new Promise(resolve => setTimeout(resolve, 50));
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                done: true,
                citations,
                contexts: []
              })}\n\n`)
            );
          } else {
            const errorMessage = result.status === 'failed' && 'error' in result
              ? result.error?.message ?? 'Failed to process your request'
              : 'Failed to process your request';
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                content: `⚠️ ${errorMessage}`,
                done: true
              })}\n\n`)
            );
          }
        } catch (error) {
          console.error('Stream error:', error);
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              content: `❌ Error: ${errorMessage}`,
              done: true
            })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
