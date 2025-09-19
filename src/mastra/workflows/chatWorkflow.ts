// ---------------------------------------------
// Workflows are a Mastra primitive to orchestrate agents and complex sequences of tasks
// Docs: https://mastra.ai/en/docs/workflows/overview
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { productRoadmapAgent } from '../agents/productRoadmapAgent';
import { streamJSONEvent, handleTextStream } from '../../utils/streamUtils';
import type { StreamTextResult } from 'ai';

// ---------------------------------------------
// Mastra nested streaming – emit placeholder events
// ---------------------------------------------

/**
 * All possible event types that can be emitted by Mastra primitives when using the
 * new nested streaming support (see https://mastra.ai/blog/nested-streaming-support).
 */
export type MastraEventType =
  | 'start'
  | 'step-start'
  | 'tool-call'
  | 'tool-result'
  | 'step-finish'
  | 'tool-output'
  | 'step-result'
  | 'step-output'
  | 'finish';

// Helper array so we can iterate easily when emitting placeholder events.
const mastraEventTypes: MastraEventType[] = [
  'start',
  'step-start',
  'tool-call',
  'tool-result',
  'step-finish',
  'tool-output',
  'step-result',
  'step-output',
  'finish',
];

// Pre-defined sample event objects that follow the shapes shown in the
// nested-streaming blog post. These are purely illustrative and use mock IDs.
const sampleMastraEvents: Record<MastraEventType, Record<string, unknown>> = {
  start: {
    type: 'start',
    from: 'AGENT',
    payload: {},
  },
  'step-start': {
    type: 'step-start',
    from: 'AGENT',
    payload: {
      messageId: 'msg_123',
      request: { role: 'user', content: 'Hello, world!' },
      warnings: [],
    },
  },
  'tool-call': {
    type: 'tool-call',
    from: 'AGENT',
    payload: {
      toolCallId: 'tc_456',
      args: { foo: 'bar' },
      toolName: 'sampleTool',
    },
  },
  'tool-result': {
    type: 'tool-result',
    from: 'AGENT',
    payload: {
      toolCallId: 'tc_456',
      toolName: 'sampleTool',
      result: { success: true },
    },
  },
  'step-finish': {
    type: 'step-finish',
    from: 'AGENT',
    payload: {
      reason: 'completed',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      },
      response: { text: 'Done!' },
      messageId: 'msg_123',
      providerMetadata: {
        openai: {
          reasoningTokens: 5,
          acceptedPredictionTokens: 10,
          rejectedPredictionTokens: 0,
          cachedPromptTokens: 0,
        },
      },
    },
  },
  'tool-output': {
    type: 'tool-output',
    from: 'USER',
    payload: {
      output: { text: 'Nested output from agent' },
      toolCallId: 'tc_456',
      toolName: 'sampleTool',
    },
  },
  'step-result': {
    type: 'step-result',
    from: 'WORKFLOW',
    payload: {
      stepName: 'exampleStep',
      result: { data: 'example' },
      stepCallId: 'sc_789',
      status: 'success',
      endedAt: Date.now(),
    },
  },
  'step-output': {
    type: 'step-output',
    from: 'USER',
    payload: {
      output: { text: 'Nested output from step' },
      toolCallId: 'tc_456',
      toolName: 'sampleTool',
    },
  },
  finish: {
    type: 'finish',
    from: 'WORKFLOW',
    payload: {
      totalUsage: {
        promptTokens: 15,
        completionTokens: 35,
        totalTokens: 50,
      },
    },
  },
};

// The emitMastraEvents step will be declared after buildAgentContext to ensure
// buildAgentContext is defined before we reference it.

export const ChatInputSchema = z.object({
  prompt: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  systemPrompt: z.string().optional(),
  // Memory linkage (optional)
  resourceId: z.string().optional(),
  threadId: z.string().optional(),
  streamController: z.any().optional(),
  // For structured output
  output: z.any().optional(),
});

export const ChatOutputSchema = z.object({
  content: z.string(),
  usage: z.any().optional(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// 1. fetchContext – passthrough (placeholder)
const fetchContext = createStep({
  id: 'fetchContext',
  description: 'Placeholder step – you might want to fetch some information for your agent here',
  inputSchema: ChatInputSchema,
  outputSchema: ChatInputSchema.extend({
    context: z.any().optional(),
  }),
  execute: async ({ inputData }) => {
    console.log('Chat workflow received input data', inputData);
    // [STEP 5] (Backend): If the user adds a node via @mention then sends a message, the agent will receive it here in the user prompt field.
    // [STEP 6] (Backend): If you call the subscribeInputContext hook on the frontend, the agent will receive that state as context, formatted in the way you specified.
    const frontendContext = inputData.prompt;

    // Merge, filter, or modify the frontend context as needed
    const unifiedContext = frontendContext;

    return { ...inputData, prompt: unifiedContext };
  },
});

// 2. buildAgentContext – build message array
const buildAgentContext = createStep({
  id: 'buildAgentContext',
  description: 'Combine fetched information and build LLM messages',
  inputSchema: fetchContext.outputSchema,
  outputSchema: ChatInputSchema.extend({
    messages: z.array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const { prompt, temperature, maxTokens, streamController, resourceId, threadId } = inputData;

    const messages = [{ role: 'user' as const, content: prompt }];

    return {
          ...inputData,
          messages,
          temperature,
          maxTokens,
          streamController,
          resourceId,
          threadId,
        };
  },
});

// 2.5 emitMastraEvents – emit a placeholder event for every new Mastra event type
const emitMastraEvents = createStep({
  id: 'emitMastraEvents',
  description: 'Emit placeholder JSON events for every Mastra nested streaming event type',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: buildAgentContext.outputSchema,
  execute: async ({ inputData }) => {
    const { streamController } = inputData;

    if (streamController) {
      for (const eventType of mastraEventTypes) {
        const sample = sampleMastraEvents[eventType];
        streamJSONEvent(streamController, sample);
      }

      streamJSONEvent(streamController, {
        type: 'alert',
        level: 'info',
        text: 'Mastra events emitted',
      });
      streamJSONEvent(streamController, {
        type: 'unregistered_event',
        level: 'info',
        text: 'Mastra events emitted',
      });
    }

    // Pass data through untouched so subsequent steps receive the original input
    return inputData;
  },
});

// 3. callAgent – invoke chatAgent
const callAgent = createStep({
  id: 'callAgent',
  description: 'Invoke the chat agent with streaming and return final text',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: ChatOutputSchema,
  execute: async ({ inputData }) => {
    const {
      messages,
      temperature,
      maxTokens,
      streamController,
      systemPrompt,
      resourceId,
      threadId,
    } = inputData;

    if (streamController) {
      streamJSONEvent(streamController, {
        type: 'progress_update',
        status: 'in_progress',
        text: 'Generating response...',
      });
    }

    const messageContents = messages.map((m) => m.content);
    const streamResult = await productRoadmapAgent.stream(messageContents, {
      ...((systemPrompt !== null) ? ({ instructions: systemPrompt } as const) : {}),
      temperature,
      maxTokens,
      ...(resourceId && threadId ? { memory: { resource: resourceId, thread: threadId } } : {}),
    });

    let finalText = '';
    if (streamController && (streamResult as unknown as StreamTextResult<any, unknown>)) {
      finalText = await handleTextStream(streamResult as unknown as StreamTextResult<any, unknown>, streamController);
      streamJSONEvent(streamController, {
        type: 'progress_update',
        status: 'complete',
        text: 'Response generated',
      });
    } else {
      for await (const chunk of (streamResult as any).textStream) {
        finalText += chunk as string;
      }
    }

    return { content: finalText };
  },
});

export const chatWorkflow = createWorkflow({
  id: 'chatWorkflow',
  description:
    'Chat workflow that replicates the old /chat/execute-function endpoint behaviour with optional streaming',
  inputSchema: ChatInputSchema,
  outputSchema: ChatOutputSchema,
})
  .then(fetchContext)
  .then(buildAgentContext)
  .then(emitMastraEvents)
  .then(callAgent)
  .commit();
