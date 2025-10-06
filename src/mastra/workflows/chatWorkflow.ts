// ---------------------------------------------
// Cedar OS Integrated Chat Workflow
// Integrates with Cedar OS state management and roadmap functionality
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { productRoadmapAgent } from '../agents/productRoadmapAgent';
import { streamJSONEvent, handleTextStream } from '../../utils/streamUtils';
import type {
  // New Cedar OS Integration Types
  BaseMessage,
  MessageRenderer,
  MessageThread,
  MessageStorageBaseAdapter,
  AgentContext,
  DiffState} from './chatWorkflowSharedTypes';
import {
  MessageSchema,
  ExecuteFunctionResponseSchema,
  ActionResponseSchema,
  MessageThreadMeta,
  DiffHistoryState,
  ContextEntry,
  AlertMessage,
  TodoListMessage,
} from './chatWorkflowSharedTypes';
import { AISpanType } from '@mastra/core/ai-tracing';

// ---------------------------------------------
// Cedar OS Integration Types
// Based on Cedar documentation: https://docs.cedarcopilot.com/type-safety/typing-agent-requests
// ---------------------------------------------

// Context schemas for additionalContext (T generic parameter)
const CedarContextSchemas = {
  nodes: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    type: z.string(),
    upvotes: z.number(),
    commentCount: z.number(),
  })).describe('Current roadmap/feature nodes'),

  selectedNodes: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    type: z.string(),
    upvotes: z.number(),
    commentCount: z.number(),
  })).describe('User-selected nodes'),

  // Cedar system fields (automatically added)
  frontendTools: z.record(z.string(), z.unknown()).optional().describe('Available frontend tools'),
  stateSetters: z.record(z.string(), z.unknown()).optional().describe('Available state setters'),
  schemas: z.record(z.string(), z.unknown()).optional().describe('Zod schemas for validation'),

  // New Cedar OS context fields
  agentContext: z.custom<AgentContext>().optional().describe('Agent context with mentions and subscriptions'),
  messageThread: z.custom<MessageThread>().optional().describe('Current message thread for conversation isolation'),
  diffState: z.custom<DiffState>().optional().describe('Current state diff tracking'),
  customMessages: z.array(z.custom<BaseMessage>()).optional().describe('Custom message types for rendering'),
};

// Custom fields schema for additional params (E generic parameter)
const CedarCustomFieldsSchema = z.object({
  resourceId: z.string().optional().describe('Memory resource identifier'),
  threadId: z.string().optional().describe('Memory thread identifier'),
  currentDate: z.string().describe('Current date context'),

  // New Cedar OS custom fields
  messageRenderer: z.custom<MessageRenderer>().optional().describe('Custom message renderer'),
  storageAdapter: z.custom<MessageStorageBaseAdapter>().optional().describe('Message storage adapter'),
  diffMode: z.enum(['defaultAccept', 'holdAccept']).optional().describe('State diff acceptance mode'),
});

// Cedar MastraParams typing (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-requests#configurable-providers-support-custom-fields
export const ChatInputSchema = z.object({
  prompt: z.string().describe('User input prompt'),
  temperature: z.number().optional().describe('LLM temperature setting'),
  maxTokens: z.number().optional().describe('Maximum tokens to generate'),
  systemPrompt: z.string().optional().describe('System prompt override'),

  // Cedar custom fields (E generic parameter)
  ...CedarCustomFieldsSchema.shape,

  // Stream controller for real-time responses
  streamController: z.any().optional().describe('Streaming controller'),

  // Structured output configuration
  output: z.any().optional().describe('Output schema for structured responses'),

  // Cedar OS Context (T generic parameter - additionalContext)
  cedarContext: z.object(CedarContextSchemas).optional().describe('Cedar OS context and state access'),
});

// ---------------------------------------------
// Mastra nested streaming support
// Docs: https://mastra.ai/blog/nested-streaming-support
// ---------------------------------------------

/**
 * Event types for Mastra workflow streaming
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

// Event templates for Cedar UI integration
const mastraEventTemplates: Record<MastraEventType, Record<string, unknown>> = {
  start: {
    type: 'start',
    from: 'WORKFLOW',
    payload: { workflowId: 'chatWorkflow' },
  },
  'step-start': {
    type: 'step-start',
    from: 'WORKFLOW',
    payload: {
      stepName: 'callAgent',
      startedAt: Date.now(),
    },
  },
  'tool-call': {
    type: 'tool-call',
    from: 'AGENT',
    payload: {
      toolCallId: 'tc_' + Date.now(),
      args: {},
      toolName: 'chatAgent',
    },
  },
  'tool-result': {
    type: 'tool-result',
    from: 'AGENT',
    payload: {
      toolCallId: 'tc_' + Date.now(),
      toolName: 'chatAgent',
      result: { success: true },
    },
  },
  'step-finish': {
    type: 'step-finish',
    from: 'WORKFLOW',
    payload: {
      reason: 'completed',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
      response: { text: '' },
      endedAt: Date.now(),
    },
  },
  'tool-output': {
    type: 'tool-output',
    from: 'AGENT',
    payload: {
      output: { text: '' },
      toolCallId: 'tc_' + Date.now(),
      toolName: 'chatAgent',
    },
  },
  'step-result': {
    type: 'step-result',
    from: 'WORKFLOW',
    payload: {
      stepName: 'callAgent',
      result: { content: '' },
      status: 'success',
      endedAt: Date.now(),
    },
  },
  'step-output': {
    type: 'step-output',
    from: 'AGENT',
    payload: {
      output: { text: '' },
      toolCallId: 'tc_' + Date.now(),
      toolName: 'chatAgent',
    },
  },
  finish: {
    type: 'finish',
    from: 'WORKFLOW',
    payload: {
      totalUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    },
  },
};

export const ChatOutputSchema = ExecuteFunctionResponseSchema;

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// 1. fetchContext – prepare context for agent
const fetchContext = createStep({
  id: 'fetchContext',
  description: 'Prepare and merge context data for the agent',
  inputSchema: ChatInputSchema,
  outputSchema: ChatInputSchema.extend({
    context: z.any().optional(),
  }),
  execute: async ({ inputData }) => {
    // Process frontend context (from @mentions, input context, etc.)
    const frontendContext = inputData.prompt;

    // Context is ready for agent processing
    return { ...inputData, context: frontendContext };
  },
});

// 2. buildAgentContext – build message array
const buildAgentContext = createStep({
  id: 'buildAgentContext',
  description: 'Combine fetched information and build LLM messages with Cedar OS context',
  inputSchema: fetchContext.outputSchema,
  outputSchema: ChatInputSchema.extend({
    messages: z.array(MessageSchema),
    // Add support for custom message types
    customMessages: z.array(z.custom<BaseMessage>()).optional(),
  }),
  execute: async ({ inputData }) => {
    const { prompt, temperature, maxTokens, streamController, resourceId, threadId, cedarContext } = inputData;

    // Build system prompt with Cedar OS context
    let enhancedSystemPrompt = inputData.systemPrompt ?? '';

    if (cedarContext) {
      const contextInfo = `
Current Roadmap State:
- Total features: ${cedarContext.nodes.length}
- Selected features: ${cedarContext.selectedNodes.length}
- Current date: ${inputData.currentDate || new Date().toISOString()}

Available Actions:
- addNode: Add a new feature to the roadmap
- removeNode: Remove a feature from the roadmap
- changeNode: Update an existing feature

When users request roadmap changes, respond with a JSON object containing 'content' (your response text) and 'action' (the roadmap action to execute).
`;

      enhancedSystemPrompt = enhancedSystemPrompt
        ? `${enhancedSystemPrompt}\n\n${contextInfo}`
        : contextInfo;
    }

    const messages = [
      { role: 'system' as const, content: enhancedSystemPrompt },
      { role: 'user' as const, content: prompt }
    ];

    return {
          ...inputData,
          messages,
          temperature,
          maxTokens,
          streamController,
          resourceId,
          threadId,
          systemPrompt: enhancedSystemPrompt,
        };
  },
});

// 2.5 emitWorkflowEvents – emit streaming events for Cedar UI
const emitWorkflowEvents = createStep({
  id: 'emitWorkflowEvents',
  description: 'Emit streaming events for Cedar UI integration',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: buildAgentContext.outputSchema,
  execute: async ({ inputData }) => {
    const { streamController } = inputData;

    if (streamController !== null) {
      // Emit workflow start
      streamJSONEvent(streamController, mastraEventTemplates.start);

      // Emit step start
      streamJSONEvent(streamController, mastraEventTemplates['step-start']);

      // Emit tool call (agent invocation)
      streamJSONEvent(streamController, mastraEventTemplates['tool-call']);
    }

    return inputData;
  },
});

// 3. callAgent – invoke chatAgent
const callAgent = createStep({
  id: 'callAgent',
  description: 'Invoke the chat agent with streaming and return final text',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: ChatOutputSchema,
  execute: async ({ inputData, tracingContext }) => {
    const {
      messages,
      temperature,
      maxTokens,
      streamController,
      systemPrompt,
      resourceId,
      threadId,
      cedarContext,
    } = inputData;

    // Create AI tracing span for agent execution
    const agentSpan = tracingContext?.currentSpan?.createChildSpan({
      type: AISpanType.AGENT_RUN,
      name: 'productRoadmapAgent-execution',
      input: {
        messageCount: messages.length,
        hasCedarContext: !!cedarContext,
        temperature,
        maxTokens,
        hasMemory: !!(resourceId && threadId && resourceId.trim() && threadId.trim()),
      },
      metadata: {
        agentId: 'productRoadmapAgent',
        workflowStep: 'callAgent',
        cedarIntegration: true,
      },
    });

    if (streamController !== null) {
      streamJSONEvent(streamController, {
        type: 'progress_update',
        status: 'in_progress',
        text: 'Generating response...',
      });
    }

    const messageContents = messages.map((m) => m.content);
    const agentOptions: Record<string, unknown> = {
      ...((systemPrompt !== null) ? ({ instructions: systemPrompt } as const) : {}),
      modelSettings: {
        temperature,
        maxOutputTokens: maxTokens,
      },
      // Enable structured output to get actions from productRoadmapAgent
      output: 'json',
    };

    if (resourceId !== null && resourceId !== '' && threadId !== null && threadId !== '') {
      agentOptions.memory = { resource: resourceId, thread: threadId };
    }


    const streamResult = await productRoadmapAgent.stream(messageContents, agentOptions);

    let finalText = '';

    // Handle streaming response
    if (streamController !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      finalText = await handleTextStream(streamResult as any, streamController);

      // Emit completion events for Cedar UI
      streamJSONEvent(streamController, {
        type: 'tool-result',
        from: 'AGENT',
        payload: {
          toolCallId: 'tc_' + Date.now(),
          toolName: 'chatAgent',
          result: { success: true, content: finalText },
        },
      });

      streamJSONEvent(streamController, {
        type: 'step-finish',
        from: 'WORKFLOW',
        payload: {
          reason: 'completed',
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
          response: { text: finalText },
          endedAt: Date.now(),
        },
      });

      streamJSONEvent(streamController, {
        type: 'step-result',
        from: 'WORKFLOW',
        payload: {
          stepName: 'callAgent',
          result: { content: finalText },
          status: 'success',
          endedAt: Date.now(),
        },
      });

      streamJSONEvent(streamController, {
        type: 'finish',
        from: 'WORKFLOW',
        payload: {
          totalUsage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
        },
      });

      streamJSONEvent(streamController, {
        type: 'progress_update',
        status: 'complete',
        text: 'Response generated',
      });
    } else {
      // Handle non-streaming response
      for await (const chunk of (streamResult as { textStream: AsyncIterable<string> }).textStream) {
        finalText += chunk;
      }
    }

    // Create child span for action parsing
    const parseSpan = agentSpan?.createChildSpan({
      type: AISpanType.GENERIC,
      name: 'parse-structured-response',
      input: {
        responseLength: finalText.length,
        isJsonResponse: finalText.trim().startsWith('{'),
      },
      metadata: {
        operation: 'action-parsing',
        workflowStep: 'callAgent',
      },
    });

    // Parse structured response from productRoadmapAgent
    let content = finalText;
    let action: z.infer<typeof ActionResponseSchema> | undefined = undefined;

    try {
      // Try to parse as JSON for structured output with actions
      const parsedResponse = JSON.parse(finalText);
      if (parsedResponse !== null && typeof parsedResponse === 'object') {
        content = (parsedResponse as Record<string, unknown>).content as string ?? (parsedResponse as Record<string, unknown>).text as string ?? finalText;
        const rawAction = (parsedResponse as Record<string, unknown>).action ?? (parsedResponse as Record<string, unknown>).object;

        // Validate action against schema
        if (rawAction !== undefined) {
          const validatedAction = ActionResponseSchema.safeParse(rawAction);
          if (validatedAction.success) {
            action = validatedAction.data;
          }
        }
      }
    } catch {
      // Not JSON, use as plain text
      content = finalText;
    }

    // End parsing span
    parseSpan?.end({
      output: {
        contentLength: content.length,
        hasAction: !!action,
        actionType: action?.type,
      },
      metadata: {
        parsingSuccess: !!action,
        contentExtracted: content !== finalText,
      },
    });

    // End agent execution span
    agentSpan?.end({
      output: {
        contentLength: content.length,
        hasAction: !!action,
        cedarContextUsed: !!cedarContext,
      },
      metadata: {
        agentId: 'productRoadmapAgent',
        workflowStep: 'callAgent',
        responseType: action ? 'structured-with-action' : 'text-only',
        cedarIntegration: true,
      },
    });

    // Return ExecuteFunctionResponseSchema format
    return {
      content,
      ...(action !== undefined && { object: action }),
    };
  },
});

export const cedarChatWorkflow = createWorkflow({
  id: 'cedarChatWorkflow',
  description: 'Streaming chat workflow with Cedar OS roadmap integration and product roadmap agent',
  inputSchema: ChatInputSchema,
  outputSchema: ChatOutputSchema,
})
  .then(fetchContext)
  .then(buildAgentContext)
  .then(emitWorkflowEvents)
  .then(callAgent)
  .commit();

// Keep the old export for backward compatibility
export const chatWorkflow = cedarChatWorkflow;
