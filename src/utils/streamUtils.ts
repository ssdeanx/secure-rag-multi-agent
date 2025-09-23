import type { StreamTextResult } from 'ai';

/* eslint-disable @typescript-eslint/no-unused-vars */

// ------------------- Functions for Data-Only SSE Format -------------------

/**
 * Uses SSE data-only format.
 * Only uses 'event: done' with empty data for completion.
 * All other content goes through 'data:' field only.
 */

export function createSSEStream(
  cb: (_controller: ReadableStreamDefaultController<Uint8Array>) => Promise<void>,
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await cb(controller);
        // Signal completion with empty data
        controller.enqueue(encoder.encode('event: done\n'));
        controller.enqueue(encoder.encode('data:\n\n'));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export function streamProgressUpdate(
  controller: ReadableStreamDefaultController<Uint8Array>,
  message: string,
  status: 'in_progress' | 'complete' | 'error',
) {
  const encoder = new TextEncoder();
  const payload = {
    type: 'progress_update',
    state: status,
    text: message,
  };
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
}

/**
 * Emit any JSON object as a data event.
 * Used for actions, tool responses, custom events, etc.
 */

export function streamJSONEvent<T>(
  controller: ReadableStreamDefaultController<Uint8Array>,
  eventData: T,
) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
}

/**
 * Handles streaming of text chunks using data-only format.
 * Compatible with new frontend parser that expects plain text chunks.
 */

export async function handleTextStream(

  streamResult: StreamTextResult<any, any>,
  streamController: ReadableStreamDefaultController<Uint8Array>,
): Promise<string> {
  const encoder = new TextEncoder();
  const chunks: string[] = [];

  // Stream raw text chunks through data field
  for await (const chunk of streamResult.textStream) {
    chunks.push(chunk);
    const lines = chunk.split('\n');
    for (const line of lines) {
      streamController.enqueue(encoder.encode(`data: ${line}\n`));
    }
    streamController.enqueue(encoder.encode('\n'));
  }

  return chunks.join('');
}
