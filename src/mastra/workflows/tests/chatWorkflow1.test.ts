import { describe, it, expect, beforeEach, vi } from 'vitest'
import { chatWorkflow } from '../chatWorkflow1'
import { starterAgent } from '../../agents/starterAgent'

// Mock the agent
vi.mock('../../agents/starterAgent', () => ({
    starterAgent: {
        generateVNext: vi.fn(),
    },
}))

describe('chatWorkflow1', () => {
    beforeEach(() => {
        // Clear all mocks between tests
        vi.clearAllMocks()

        // Setup default mock implementation with structured output
        ;(starterAgent.generateVNext as any).mockResolvedValue({
            text: 'Test response',
            object: {
                type: 'response',
                content: 'Test response content',
            },
        })
    })

    it('should execute workflow with valid input data and return response', async () => {
        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Hello, how are you?',
                temperature: 0.7,
                maxTokens: 150,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        if (result?.status === 'success') {
            const output = (result as any).result
            expect(output.content).toBeDefined()
            expect(typeof output.content).toBe('string')
        }
    })

    it('should handle prompt without temperature', async () => {
        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'What is TypeScript?',
                maxTokens: 200,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        // Verify the agent was called (temperature will be undefined since not provided)
        expect(starterAgent.generateVNext).toHaveBeenCalled()
    })

    it('should handle prompt without maxTokens', async () => {
        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Explain React hooks',
                temperature: 0.5,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        // Verify the agent was called (maxTokens will be undefined since not provided)
        expect(starterAgent.generateVNext).toHaveBeenCalled()
    })

    it('should handle custom temperature and maxTokens', async () => {
        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Write a poem about code',
                temperature: 0.9,
                maxTokens: 300,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        // Verify the agent was called with custom settings
        expect(starterAgent.generateVNext).toHaveBeenCalledWith(
            expect.any(Array),
            expect.objectContaining({
                modelSettings: expect.objectContaining({
                    temperature: 0.9,
                    maxOutputTokens: 300,
                }),
            })
        )
    })

    it('should include systemPrompt when provided', async () => {
        ;(starterAgent.generateVNext as any).mockResolvedValue({
            text: 'Technical response',
            object: {
                type: 'response',
                content: 'Technical response content',
            },
        })

        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Explain async/await',
                systemPrompt: 'You are a technical expert',
                temperature: 0.7,
                maxTokens: 200,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        // Verify the agent was called with instructions
        expect(starterAgent.generateVNext).toHaveBeenCalledWith(
            expect.any(Array),
            expect.objectContaining({
                instructions: 'You are a technical expert',
            })
        )
    })

    it('should handle structured output with action type', async () => {
        ;(starterAgent.generateVNext as any).mockResolvedValue({
            text: 'Action response',
            object: {
                content: 'Action response content',
                action: {
                    type: 'action',
                    stateKey: 'testState',
                    setterKey: 'setTestState',
                    args: ['test', 'value'],
                },
            },
        })

        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Perform an action',
                temperature: 0.7,
                maxTokens: 150,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        if (result?.status === 'success') {
            const output = (result as any).result
            expect(output.content).toBeDefined()
            expect(typeof output.content).toBe('string')
            // Check that the action object was included
            expect(output.object).toBeDefined()
        }
    })

    it('should handle structured output with complete type', async () => {
        ;(starterAgent.generateVNext as any).mockResolvedValue({
            text: 'Complete response',
            object: {
                type: 'complete',
                content: 'Task completed successfully',
            },
        })

        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'Complete this task',
                temperature: 0.7,
                maxTokens: 150,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')
    })

    it('should handle agent errors gracefully', async () => {
        ;(starterAgent.generateVNext as any).mockRejectedValue(
            new Error('API Error')
        )

        const run = await chatWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                prompt: 'This will fail',
                temperature: 0.7,
                maxTokens: 150,
            },
        })

        const result = await stream.result

        // Workflow should handle error appropriately
        expect(result).toBeDefined()
    })
})
