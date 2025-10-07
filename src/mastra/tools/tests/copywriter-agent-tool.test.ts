import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { copywriterTool } from '../copywriter-agent-tool'

// Mock external dependencies
vi.mock('../config/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

describe('Copywriter Agent Tool', () => {
    const mockRuntimeContext = {} as any
    let mockSpan: any
    const mockTracingContext = {
        currentSpan: {
            createChildSpan: vi.fn().mockImplementation(() => {
                mockSpan = { end: vi.fn() }
                return mockSpan
            }),
        },
    } as any

    let mockAgent: any
    let mockMastra: any

    beforeEach(() => {
        vi.clearAllMocks()
        mockSpan = undefined

        // Reset the mock implementation after clearing
        mockTracingContext.currentSpan.createChildSpan.mockImplementation(
            () => {
                mockSpan = { end: vi.fn() }
                return mockSpan
            }
        )

        // Mock the agent
        mockAgent = {
            generate: vi.fn(),
        }

        // Mock mastra
        mockMastra = {
            getAgent: vi.fn().mockReturnValue(mockAgent),
        }
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('successful content generation', () => {
        it('should generate blog content successfully with minimal parameters', async () => {
            const mockContent = `# Sample Blog Post

This is a sample blog post about artificial intelligence.

## Introduction

AI is transforming our world in many ways.

## Conclusion

The future of AI is bright.`

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'artificial intelligence' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                content: mockContent,
                contentType: 'blog',
                title: 'Sample Blog Post',
                summary: '# Sample Blog Post',
                keyPoints: [],
                wordCount: 31,
            })

            expect(mockMastra.getAgent).toHaveBeenCalledWith('copywriterAgent')
            expect(mockAgent.generate).toHaveBeenCalledWith(
                'Create medium blog content about: artificial intelligence\n\nCreate a well-structured blog post with engaging introduction, body sections, and conclusion.'
            )
        })

        it('should generate marketing content with all parameters', async () => {
            const mockContent = `🚀 Transform Your Business with AI Solutions!

Are you ready to revolutionize your operations? Our cutting-edge AI solutions deliver measurable results.

**Key Benefits:**
- Increased efficiency by 300%
- Cost reduction of 40%
- Enhanced decision making

Contact us today to get started!`

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: {
                    topic: 'AI business solutions',
                    contentType: 'marketing',
                    targetAudience: 'business executives',
                    tone: 'persuasive',
                    length: 'short',
                    specificRequirements:
                        'Include call-to-action and statistics',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.contentType).toBe('marketing')
            expect(result.content).toBe(mockContent)
            expect(result.wordCount).toBeGreaterThan(0)

            expect(mockAgent.generate).toHaveBeenCalledWith(
                'Create short marketing content about: AI business solutions\n\nTarget audience: business executives\n\nDesired tone: persuasive\n\nSpecific requirements: Include call-to-action and statistics\n\nCreate persuasive marketing copy that highlights benefits and includes clear calls-to-action.'
            )
        })

        it('should generate social media content', async () => {
            const mockContent = `💡 Did you know? AI is revolutionizing healthcare! From diagnostic assistance to personalized treatment plans, artificial intelligence is saving lives and improving patient outcomes.

What's your take on AI in healthcare? Share below! 👇

#AI #Healthcare #Innovation #FutureOfMedicine`

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: {
                    topic: 'AI in healthcare',
                    contentType: 'social',
                    tone: 'engaging',
                    length: 'short',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.contentType).toBe('social')
            expect(result.title).toBeUndefined() // Social content might not have titles
        })

        it('should generate technical content', async () => {
            const mockContent = `# Understanding Neural Networks

## What are Neural Networks?

Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process and transmit information.

## How They Work

1. **Input Layer**: Receives raw data
2. **Hidden Layers**: Process information through weighted connections
3. **Output Layer**: Produces results

## Key Concepts

- **Weights**: Connection strengths between neurons
- **Activation Functions**: Determine neuron output
- **Backpropagation**: Learning algorithm

## Code Example

\`\`\`python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\``

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: {
                    topic: 'neural networks',
                    contentType: 'technical',
                    targetAudience: 'developers',
                    length: 'long',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.contentType).toBe('technical')
            expect(result.title).toBe('Understanding Neural Networks')
            expect(result.keyPoints).toEqual([]) // Currently not implemented
        })

        it('should handle content without title', async () => {
            const mockContent = `This is content without a markdown title.

It discusses various topics and provides insights into the subject matter.

The conclusion wraps up the main points discussed.`

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'general discussion' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.title).toBeUndefined()
            expect(result.summary).toBe(
                'This is content without a markdown title.'
            )
        })

        it('should truncate long summaries', async () => {
            const longParagraph = 'A'.repeat(250)
            const mockContent = `${longParagraph}\n\nThis is the second paragraph.`

            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'long content' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.summary!.length).toBeLessThanOrEqual(203) // 200 + '...'
            expect(result.summary!.endsWith('...')).toBe(true)
        })
    })

    describe('error handling', () => {
        it('should throw error for unsupported content type', async () => {
            await expect(
                copywriterTool.execute({
                    context: {
                        topic: 'test',
                        contentType: 'general' as any,
                    },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Not implemented yet: "general" case')
        })

        it('should handle agent generation errors', async () => {
            const error = new Error('Agent failed to generate content')
            mockAgent.generate.mockRejectedValue(error)

            await expect(
                copywriterTool.execute({
                    context: { topic: 'failing topic' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Agent failed to generate content')
        })

        it('should handle non-Error exceptions', async () => {
            mockAgent.generate.mockRejectedValue('String error')

            await expect(
                copywriterTool.execute({
                    context: { topic: 'failing topic' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Unknown error')
        })
    })

    describe('tracing', () => {
        it('should create and end tracing spans correctly', async () => {
            const mockContent = 'Simple content'
            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            await copywriterTool.execute({
                context: {
                    topic: 'traced topic',
                    contentType: 'marketing',
                    targetAudience: 'testers',
                    tone: 'professional',
                    length: 'short',
                    specificRequirements: 'test requirements',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(
                mockTracingContext.currentSpan.createChildSpan
            ).toHaveBeenCalledWith({
                type: expect.any(String),
                name: 'copywriter-agent-tool',
                input: {
                    topic: 'traced topic',
                    contentType: 'marketing',
                    targetAudience: 'testers',
                    tone: 'professional',
                    length: 'short',
                    hasRequirements: true,
                },
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                output: {
                    success: true,
                    contentType: 'marketing',
                    wordCount: 2,
                    hasTitle: false,
                    contentLength: mockContent.length,
                },
            })
        })

        it('should handle tracing on error', async () => {
            const error = new Error('Generation failed')
            mockAgent.generate.mockRejectedValue(error)

            await expect(
                copywriterTool.execute({
                    context: { topic: 'error topic' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow()

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: {
                    success: false,
                    error: 'Generation failed',
                    topic: 'error topic',
                    contentType: 'blog',
                },
            })
        })
    })

    describe('content parsing', () => {
        it('should extract title from H1 headers', async () => {
            const mockContent = `# Main Title\n\nContent here.`
            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'title test' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.title).toBe('Main Title')
        })

        it('should extract title from H2 headers', async () => {
            const mockContent = `## Secondary Title\n\nContent here.`
            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'title test' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.title).toBe('Secondary Title')
        })

        it('should calculate word count correctly', async () => {
            const mockContent =
                'This is a test. It has multiple sentences.\n\nAnd paragraphs too!'
            mockAgent.generate.mockResolvedValue({
                text: mockContent,
            })

            const result = await copywriterTool.execute({
                context: { topic: 'word count test' },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.wordCount).toBe(11) // This(1) is(2) a(3) test(4). It(5) has(6) multiple(7) sentences(8).\n\nAnd(9) paragraphs(10) too(11)!(12)
        })
    })
})
