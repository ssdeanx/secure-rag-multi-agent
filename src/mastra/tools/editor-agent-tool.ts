import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'

export const editorTool = createTool({
    id: 'editor-agent',
    description:
        'Calls the editor agent to edit and improve content across multiple formats including blog posts, technical documentation, business communications, creative writing, and general content.',
    inputSchema: z.object({
        content: z.string().describe('The content to be edited'),
        contentType: z
            .enum(['blog', 'technical', 'business', 'creative', 'general'])
            .optional()
            .describe(
                "The type of content being edited (defaults to 'general')"
            ),
        instructions: z
            .string()
            .optional()
            .describe('Specific editing instructions or focus areas'),
        tone: z
            .enum(['professional', 'casual', 'formal', 'engaging', 'technical'])
            .optional()
            .describe('Desired tone for the edited content'),
    }),
    outputSchema: z.object({
        editedContent: z.string().describe('The edited and improved content'),
        contentType: z.string().describe('The identified content type'),
        changes: z.array(z.string()).describe('List of key changes made'),
        suggestions: z
            .array(z.string())
            .optional()
            .describe('Additional suggestions for improvement'),
    }),
    execute: async ({ context, mastra, tracingContext }) => {
        const { content, contentType = 'general', instructions, tone } = context

        // Create a span for tracing
        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'editor-agent-tool',
            input: {
                contentType,
                contentLength: content.length,
                hasInstructions: !!instructions,
                tone: tone ?? 'not-specified',
            },
        })

        try {
            const agent = mastra!.getAgent('editorAgent')

            // Build the prompt with context
            let prompt = `Edit the following content`
            if (contentType !== 'general') {
                prompt += ` (content type: ${contentType})`
            }
            if (tone) {
                prompt += ` with a ${tone} tone`
            }
            if (instructions) {
                prompt += `. Additional instructions: ${instructions}`
            }
            prompt += `:\n\n${content}`

            const result = await agent.generate(prompt)

            // Parse the structured response from the editor agent
            let parsedResult
            try {
                parsedResult = JSON.parse(result.text)
            } catch (e) {
                // Fallback for non-JSON responses
                parsedResult = {
                    editedContent: result.text,
                    contentType,
                    changes: ['Content edited and improved'],
                    suggestions: [],
                }
            }

            span?.end({
                output: {
                    success: true,
                    outputLength: parsedResult.editedContent?.length ?? 0,
                    changesCount: parsedResult.changes?.length ?? 0,
                    contentType: parsedResult.contentType ?? contentType,
                },
            })

            return {
                editedContent:
                    parsedResult.editedContent ??
                    parsedResult.copy ??
                    result.text,
                contentType: parsedResult.contentType ?? contentType,
                changes: parsedResult.changes ?? [
                    'Content edited and improved',
                ],
                suggestions: parsedResult.suggestions ?? [],
            }
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : 'Unknown error'
            span?.end({
                metadata: {
                    success: false,
                    error: errorMsg,
                },
            })
            throw new Error(`Failed to edit content: ${errorMsg}`)
        }
    },
})
