import { mastra } from '@/src/mastra';

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

// Configure timeout config
const STATUS_VALUE = 400;
export const maxDuration = 60; // 60 seconds for chat responses
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { jwt, question } = await request.json();

    if (!jwt || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: STATUS_VALUE }
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
            const chunks = answer.match(/.{1,50}/g) || [answer];
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
              ? result.error?.message || 'Failed to process your request'
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
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
