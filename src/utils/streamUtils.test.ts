import { describe, it, expect, vi } from 'vitest'
import {
    createSSEStream,
    streamProgressUpdate,
    streamJSONEvent,
    handleTextStream,
} from './streamUtils'
import type { StreamTextResult, ToolSet } from 'ai'

describe('streamUtils', () => {
    describe('createSSEStream', () => {
        it('should create a Response with correct SSE headers', async () => {
            const callback = vi.fn(async (controller) => {
                controller.enqueue(new TextEncoder().encode('data: test\n\n'))
            })

            const response = createSSEStream(callback)

            expect(response).toBeInstanceOf(Response)
            expect(response.headers.get('Content-Type')).toBe(
                'text/event-stream'
            )
            expect(response.headers.get('Cache-Control')).toBe('no-cache')
            expect(response.headers.get('Connection')).toBe('keep-alive')
        })

        it('should call the callback with a controller', async () => {
            const callback = vi.fn(async (controller) => {
                expect(controller).toBeDefined()
                expect(typeof controller.enqueue).toBe('function')
            })

            const response = createSSEStream(callback)
            const reader = response.body?.getReader()

            // Read the stream to trigger callback execution
            await reader?.read()
            await reader?.cancel()

            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('should send done event on completion', async () => {
            const callback = vi.fn(async (controller) => {
                controller.enqueue(new TextEncoder().encode('data: test\n\n'))
            })

            const response = createSSEStream(callback)
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            const chunks: string[] = []

            while (true) {
                const { done, value } = await reader!.read()
                if (done) {
                    break
                }
                chunks.push(decoder.decode(value, { stream: true }))
            }

            const fullContent = chunks.join('')
            expect(fullContent).toContain('event: done')
            expect(fullContent).toContain('data:\n\n')
        })

        it('should handle errors gracefully', async () => {
            const callback = vi.fn(async () => {
                throw new Error('Test error')
            })

            const response = createSSEStream(callback)
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            const chunks: string[] = []

            while (true) {
                const { done, value } = await reader!.read()
                if (done) {
                    break
                }
                chunks.push(decoder.decode(value, { stream: true }))
            }

            const fullContent = chunks.join('')
            expect(fullContent).toContain('type')
            expect(fullContent).toContain('error')
            expect(fullContent).toContain('Test error')
        })
    })

    describe('streamProgressUpdate', () => {
        it('should encode progress update correctly', () => {
            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            streamProgressUpdate(mockController, 'Processing...', 'in_progress')

            expect(mockController.enqueue).toHaveBeenCalledTimes(1)
            const call = (mockController.enqueue as ReturnType<typeof vi.fn>)
                .mock.calls[0][0]
            const decoded = new TextDecoder().decode(call)

            expect(decoded).toContain('data: ')
            expect(decoded).toContain('type')
            expect(decoded).toContain('progress_update')
            expect(decoded).toContain('Processing...')
            expect(decoded).toContain('in_progress')
        })

        it('should handle different status values', () => {
            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const statuses = ['in_progress', 'complete', 'error'] as const
            statuses.forEach((status) => {
                streamProgressUpdate(
                    mockController,
                    `Status: ${status}`,
                    status
                )
            })

            expect(mockController.enqueue).toHaveBeenCalledTimes(
                statuses.length
            )
        })
    })

    describe('streamJSONEvent', () => {
        it('should encode JSON event correctly', () => {
            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const testData = {
                type: 'test',
                value: 42,
                nested: { key: 'value' },
            }
            streamJSONEvent(mockController, testData)

            expect(mockController.enqueue).toHaveBeenCalledTimes(1)
            const call = (mockController.enqueue as ReturnType<typeof vi.fn>)
                .mock.calls[0][0]
            const decoded = new TextDecoder().decode(call)

            expect(decoded).toContain('data: ')
            expect(decoded).toContain('"type":"test"')
            expect(decoded).toContain('"value":42')
            expect(decoded).toContain('"nested"')
        })

        it('should handle arrays', () => {
            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const testData = [{ id: 1 }, { id: 2 }, { id: 3 }]
            streamJSONEvent(mockController, testData)

            const call = (mockController.enqueue as ReturnType<typeof vi.fn>)
                .mock.calls[0][0]
            const decoded = new TextDecoder().decode(call)

            expect(decoded).toContain('[')
            expect(decoded).toContain('"id":1')
            expect(decoded).toContain('"id":2')
            expect(decoded).toContain('"id":3')
        })

        it('should handle primitive values', () => {
            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            streamJSONEvent(mockController, 'string value')
            streamJSONEvent(mockController, 123)
            streamJSONEvent(mockController, true)
            streamJSONEvent(mockController, null)

            expect(mockController.enqueue).toHaveBeenCalledTimes(4)
        })
    })

    describe('handleTextStream', () => {
        it('should handle text stream and return full text', async () => {
            const chunks = ['Hello ', 'world', '!']
            const mockTextStream = (async function* () {
                for (const chunk of chunks) {
                    yield chunk
                }
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const result = await handleTextStream(
                mockStreamResult,
                mockController
            )

            expect(result).toBe('Hello world!')
            expect(mockController.enqueue).toHaveBeenCalled()
        })

        it('should encode each chunk correctly', async () => {
            const chunks = ['Test chunk']
            const mockTextStream = (async function* () {
                for (const chunk of chunks) {
                    yield chunk
                }
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            await handleTextStream(mockStreamResult, mockController)

            const calls = (mockController.enqueue as ReturnType<typeof vi.fn>)
                .mock.calls
            expect(calls.length).toBeGreaterThan(0)

            // Check that chunks are encoded with 'data: ' prefix
            const decoded = new TextDecoder().decode(calls[0][0])
            expect(decoded).toContain('data: ')
        })

        it('should handle multi-line chunks', async () => {
            const chunks = ['Line 1\nLine 2\nLine 3']
            const mockTextStream = (async function* () {
                for (const chunk of chunks) {
                    yield chunk
                }
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const result = await handleTextStream(
                mockStreamResult,
                mockController
            )

            expect(result).toContain('Line 1')
            expect(result).toContain('Line 2')
            expect(result).toContain('Line 3')
        })

        it('should handle empty stream', async () => {
            const mockTextStream = (async function* (): AsyncGenerator<
                string,
                void,
                unknown
            > {
                // Empty stream
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const result = await handleTextStream(
                mockStreamResult,
                mockController
            )

            expect(result).toBe('')
        })

        it('should handle stream with special characters', async () => {
            const chunks = [
                '{"test": "value"}',
                '<html>content</html>',
                'emoji 🎉',
            ]
            const mockTextStream = (async function* () {
                for (const chunk of chunks) {
                    yield chunk
                }
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const mockController = {
                enqueue: vi.fn(),
            } as unknown as ReadableStreamDefaultController<Uint8Array>

            const result = await handleTextStream(
                mockStreamResult,
                mockController
            )

            expect(result).toContain('{"test": "value"}')
            expect(result).toContain('<html>content</html>')
            expect(result).toContain('🎉')
        })
    })

    describe('Integration tests', () => {
        it('should work together in a typical streaming workflow', async () => {
            const chunks = ['Processing', ' your', ' request', '...']
            const mockTextStream = (async function* () {
                for (const chunk of chunks) {
                    yield chunk
                }
            })()

            const mockStreamResult = {
                textStream: mockTextStream,
            } as unknown as StreamTextResult<ToolSet, unknown>

            const response = createSSEStream(async (controller) => {
                streamProgressUpdate(controller, 'Starting...', 'in_progress')
                streamJSONEvent(controller, {
                    type: 'start',
                    timestamp: Date.now(),
                })

                const result = await handleTextStream(
                    mockStreamResult,
                    controller
                )

                streamJSONEvent(controller, { type: 'complete', result })
                streamProgressUpdate(controller, 'Done!', 'complete')
            })

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            const allChunks: string[] = []

            while (true) {
                const { done, value } = await reader!.read()
                if (done) {
                    break
                }
                allChunks.push(decoder.decode(value, { stream: true }))
            }

            const fullContent = allChunks.join('')

            expect(fullContent).toContain('Starting...')
            expect(fullContent).toContain('Done!')
            expect(fullContent).toContain('Processing your request...')
            expect(fullContent).toContain('event: done')
        })
    })
})
