// ---------------------------------------------
// Workflows are a Mastra primitive to orchestrate agents and complex sequences of tasks
// Docs: https://mastra.ai/en/docs/workflows/overview
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { starterAgent } from '../agents/starterAgent';
import { streamJSONEvent, streamProgressUpdate } from '../../utils/streamUtils';
import { ActionSchema, ChatAgentResponseSchema } from './chatWorkflowTypes1';

export const ChatInputSchema = z.object({
  prompt: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  systemPrompt: z.string().optional(),
  streamController: z.any().optional(), // For streaming
});

export const ChatOutputSchema = z.object({
  content: z.string(),
  // TODO: Add any structured output fields your application needs
  object: ActionSchema.optional(),
  usage: z.any().optional(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// 1. fetchContext – passthrough (placeholder)
const fetchContext = createStep({
  id: 'fetchContext',
  description: 'Fetch any additional context needed for the agent',
  inputSchema: ChatInputSchema,
  outputSchema: ChatInputSchema.extend({
    context: z.any().optional(),
  }),
  execute: async ({ inputData }) => {
    console.log('Chat workflow received input data', inputData);
    // Any context that the frontend wants to send to the agent
    const frontendContext = inputData.prompt;

    // TODO: Implement any context fetching logic here
    // This could include:
    // - Database queries
    // - External API calls
    // - User session data
    // - Application state

    const result = { ...inputData, prompt: frontendContext };

    return result;
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
    const { prompt, temperature, maxTokens, streamController } = inputData;

    const messages = [{ role: 'user' as const, content: prompt }];

    const result = { ...inputData, messages, temperature, maxTokens, streamController };

    return result;
  },
});

// 3. callAgent – invoke chatAgent
const callAgent = createStep({
  id: 'callAgent',
  description: 'Invoke the chat agent with options',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: ChatOutputSchema,
  execute: async ({ inputData }) => {
    const { messages, temperature, maxTokens, streamController, systemPrompt } = inputData;

    if (streamController) {
      streamProgressUpdate(streamController, 'Generating response...', 'in_progress');
    }

    const response = await starterAgent.generate(messages.map((m) => m.content), {
      // If system prompt is provided, overwrite the default system prompt for this agent
      ...(systemPrompt ? ({ instructions: systemPrompt } as const) : {}),
      temperature,
      maxTokens,
      experimental_output: ChatAgentResponseSchema,
    });

    const { content, action } = response.object ?? {
      content: response.text,
    };

    const result: ChatOutput = {
      content,
      object: action,
      usage: response.usage,
    };

    console.log('Chat workflow result', result);
    if (streamController) {
      streamJSONEvent(streamController, result);
    }

    if (streamController) {
      streamProgressUpdate(streamController, 'Response generated', 'complete');
    }

    return result;
  },
});

export const chatWorkflow = createWorkflow({
  id: 'chatWorkflow',
  description: 'Chat workflow that handles agent interactions with optional streaming support',
  inputSchema: ChatInputSchema,
  outputSchema: ChatOutputSchema,
})
  .then(fetchContext)
  .then(buildAgentContext)
  .then(callAgent)
  .commit();
