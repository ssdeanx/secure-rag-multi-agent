import type { StreamTextResult, ToolSet } from 'ai'

// ------------------- Functions for Data-Only SSE Format -------------------

/**
 * Uses SSE data-only format.
 * Only uses 'event: done' with empty data for completion.
 * All other content goes through 'data:' field only.
 *
 * @param cb - Callback function that receives the stream controller
 * @returns Response object with SSE headers
 */
export function createSSEStream(
    cb: (
        controller: ReadableStreamDefaultController<Uint8Array>
    ) => Promise<void>
): Response {
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                await cb(controller)
                // Signal completion with empty data
                controller.enqueue(encoder.encode('event: done\n'))
                controller.enqueue(encoder.encode('data:\n\n'))
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Internal error'
                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({ type: 'error', message })}\n\n`
                    )
                )
            } finally {
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}

/**
 * Stream a progress update event
 *
 * @param controller - The stream controller to enqueue the event to
 * @param message - Progress message text
 * @param status - Current status of the operation
 */
export function streamProgressUpdate(
    controller: ReadableStreamDefaultController<Uint8Array>,
    message: string,
    status: 'in_progress' | 'complete' | 'error'
): void {
    const encoder = new TextEncoder()
    const payload = {
        type: 'progress_update',
        state: status,
        text: message,
    }
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
}

/**
 * Emit any JSON object as a data event.
 * Used for actions, tool responses, custom events, etc.
 *
 * @param controller - The stream controller to enqueue the event to
 * @param eventData - The event data to serialize and send
 */
export function streamJSONEvent<T>(
    controller: ReadableStreamDefaultController<Uint8Array>,
    eventData: T
): void {
    const encoder = new TextEncoder()
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`))
}

/**
 * Handles streaming of text chunks using data-only format.
 * Compatible with Cedar OS frontend parser that expects plain text chunks.
 * Works with both AI SDK StreamTextResult and Mastra agent stream outputs.
 *
 * @param streamResult - The AI SDK StreamTextResult or any object with a textStream property
 * @param streamController - The stream controller to write chunks to
 * @returns Promise resolving to the complete text
 *
 * @example
 * ```ts
 * const result = await agent.stream(messages);
 * const fullText = await handleTextStream(result, controller);
 * ```
 */
export async function handleTextStream<TOOLS extends ToolSet = ToolSet>(
    streamResult:
        | StreamTextResult<TOOLS, unknown>
        | { textStream: AsyncIterable<string> },
    streamController: ReadableStreamDefaultController<Uint8Array>
): Promise<string> {
    const encoder = new TextEncoder()
    const chunks: string[] = []

    // Stream raw text chunks through data field
    for await (const chunk of streamResult.textStream) {
        chunks.push(chunk)
        const lines = chunk.split('\n')
        for (const line of lines) {
            streamController.enqueue(encoder.encode(`data: ${line}\n`))
        }
        streamController.enqueue(encoder.encode('\n\n'))
    }

    return chunks.join('')
}
