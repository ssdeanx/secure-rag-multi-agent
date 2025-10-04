import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatWorkflow } from '../chatWorkflow';
import { productRoadmapAgent } from '../../agents/productRoadmapAgent';

// Mock the agent
vi.mock('../../agents/productRoadmapAgent', () => ({
  productRoadmapAgent: {
    streamVNext: vi.fn()
  }
}));

describe('chatWorkflow', () => {
  beforeEach(() => {
    // Clear all mocks between tests
    vi.clearAllMocks();
    
    // Setup default mock implementation for streaming
    (productRoadmapAgent.streamVNext as any).mockResolvedValue({
      textStream: (async function* () {
        yield 'Test';
        yield ' streaming';
        yield ' response';
      })(),
      text: Promise.resolve('Test streaming response')
    });
  });

  it('should execute workflow with valid input data and return response', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Hello, how are you?',
        temperature: 0.7,
        maxTokens: 150
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    if (result?.status === 'success') {
      const output = (result as any).result;
      expect(output.content).toBeDefined();
      expect(typeof output.content).toBe('string');
    }
  });

  it('should handle prompt without temperature', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'What is TypeScript?',
        maxTokens: 200
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called (temperature will be undefined since not provided)
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalled();
  });

  it('should handle prompt without maxTokens', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Explain React hooks',
        temperature: 0.5
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called (maxTokens will be undefined since not provided)
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalled();
  });

  it('should handle custom temperature and maxTokens', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Write a poem about code',
        temperature: 0.9,
        maxTokens: 300
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called with custom settings
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        modelSettings: expect.objectContaining({
          temperature: 0.9,
          maxOutputTokens: 300
        })
      })
    );
  });

  it('should handle streaming with memory context', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Continue our conversation',
        temperature: 0.7,
        maxTokens: 200,
        resourceId: 'user-123',
        threadId: 'thread-456'
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called with memory configuration
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        memory: {
          resource: 'user-123',
          thread: 'thread-456'
        }
      })
    );
  });

  it('should include systemPrompt when provided', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Explain async/await',
        systemPrompt: 'You are a technical expert',
        temperature: 0.7,
        maxTokens: 200
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called with instructions
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        instructions: 'You are a technical expert'
      })
    );
  });

  it('should handle prompt with conversation context', async () => {
    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'Follow up: Can you explain that in more detail?',
        temperature: 0.7,
        maxTokens: 150
      },
    });

    const result = await stream.result;

    expect(result).toBeDefined();
    expect(result?.status).toBe('success');
    
    // Verify the agent was called
    expect(productRoadmapAgent.streamVNext).toHaveBeenCalled();
  });

  it('should handle agent errors gracefully', async () => {
    (productRoadmapAgent.streamVNext as any).mockRejectedValue(new Error('Streaming Error'));

    const run = await chatWorkflow.createRunAsync();

    const stream = run.streamVNext({
      inputData: {
        prompt: 'This will fail',
        temperature: 0.7,
        maxTokens: 150
      },
    });

    const result = await stream.result;

    // Workflow should handle error appropriately
    expect(result).toBeDefined();
  });
});
