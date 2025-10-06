/* eslint-disable no-unused-vars */
// This file contains type definitions only - parameters are part of the type contract
// and are not "used" in the traditional sense

import { z } from 'zod';
import type { ReactNode } from 'react';

// ==========================================
// Cedar OS Integration Types for Mastra Workflows
// Based on: https://docs.cedarcopilot.com/
// Version: Cedar OS v0.1.11+
// ==========================================

// ---------------------------------------------
// Message Rendering Types (from Custom Message Rendering)
// Based on: https://docs.cedarcopilot.com/chat/custom-message-rendering
// ---------------------------------------------

// Base message interface that all Cedar messages extend
export interface BaseMessage {
  id: string; // Unique identifier (auto-generated if not provided)
  role: MessageRole; // 'bot' | 'user' | 'assistant'
  content: string; // The text content of the message
  createdAt?: string; // ISO timestamp (auto-generated)
  metadata?: Record<string, unknown>; // Optional key-value pairs
  type: string; // String identifier for renderer matching
}

// Message role types
export type MessageRole = 'bot' | 'user' | 'assistant';

// Custom message type factory for type-safe custom messages
export type CustomMessage<
  T extends string,
  P extends object = Record<string, never>
> = BaseMessage & { type: T } & P;

// Message renderer interface for custom rendering
// Based on: https://docs.cedarcopilot.com/chat/custom-message-rendering
export interface MessageRenderer<T extends BaseMessage = BaseMessage> {
  type: T['type']; // Must match the message type
  render: (message: T) => ReactNode; // Receives narrowly typed message
  namespace?: string; // Optional organization namespace
  validateMessage?: (message: BaseMessage) => message is T; // Runtime validation
}

// Built-in message types
export type AlertMessage = CustomMessage<'alert', { level: 'info' | 'warning' | 'error' }>;
export type TodoListMessage = CustomMessage<'todo-list', {
  items: Array<{ id: string; text: string; completed: boolean }>;
  onToggle?: (id: string) => void;
}>;

// ---------------------------------------------
// Agent Context Types (from Agent Context)
// Based on: https://docs.cedarcopilot.com/agent-context/agent-context
// ---------------------------------------------

// Context entry structure for agent context
export interface ContextEntry {
  id: string;
  source: string; // 'mention' | 'subscription' | 'manual'
  data: Record<string, unknown>;
  metadata?: {
    label?: string;
    color?: string;
    order?: number;
  };
}

// Agent context structure sent to backend
export interface AgentContext {
  [key: string]: ContextEntry[];
}

// ---------------------------------------------
// Thread Management Types (from Thread Management)
// Based on: https://docs.cedarcopilot.com/chat/thread-management
// ---------------------------------------------

// Thread structure for conversation isolation
export interface MessageThread {
  id: string;
  name?: string;
  lastLoaded: string;
  messages: BaseMessage[];
}

// Thread metadata for storage
export interface MessageThreadMeta {
  id: string;
  title?: string;
  updatedAt: string;
  messageCount?: number;
  lastMessage?: string;
}

// ---------------------------------------------
// Message Storage Types (from Message Storage Configuration)
// Based on: https://docs.cedarcopilot.com/chat/message-storage-configuration
// ---------------------------------------------

// Storage adapter interface for persistence
// Based on: https://docs.cedarcopilot.com/chat/message-storage-configuration
export interface MessageStorageBaseAdapter {
  // Required methods
  loadMessages: (userId: string, threadId: string) => Promise<BaseMessage[]>;
  persistMessage: (userId: string, threadId: string, message: BaseMessage) => Promise<BaseMessage>;

  // Optional thread methods
  listThreads?: (userId: string) => Promise<MessageThreadMeta[]>;
  createThread?: (userId: string, threadId: string, meta: MessageThreadMeta) => Promise<MessageThreadMeta>;
  updateThread?: (userId: string, threadId: string, meta: MessageThreadMeta) => Promise<MessageThreadMeta>;
  deleteThread?: (userId: string, threadId: string) => Promise<MessageThreadMeta | undefined>;

  // Optional message methods
  updateMessage?: (userId: string, threadId: string, message: BaseMessage) => Promise<BaseMessage>;
  deleteMessage?: (userId: string, threadId: string, messageId: string) => Promise<BaseMessage | undefined>;
}

// ---------------------------------------------
// State Subscription Types (from State Subscription)
// Based on: https://docs.cedarcopilot.com/agent-context/subscribing-state
// ---------------------------------------------

// Element type helper for state subscription functions
export type ElementType<T> = T extends Array<infer U> ? U : T;

// State subscription options interface
// Based on: https://docs.cedarcopilot.com/agent-context/subscribing-state
export interface StateSubscriptionOptions {
  icon?: ReactNode | ((item: ElementType<unknown>) => ReactNode);
  color?: string;
  labelField?: string | ((item: ElementType<unknown>) => string);
  order?: number;
  showInChat?: boolean | ((entry: ContextEntry) => boolean);
  collapse?:
    | boolean
    | number
    | {
        threshold: number;
        label?: string;
        icon?: ReactNode;
      };
}

// State subscription function type
export type StateSubscriptionMapFn<T> = (state: T) => Record<string, unknown>;

// ---------------------------------------------
// Mention Types (from Mentions)
// Based on: https://docs.cedarcopilot.com/agent-context/mentions
// ---------------------------------------------

// Mention item interface
export interface MentionItem {
  id: string;
  label: string;
  data: Record<string, unknown>;
  metadata?: {
    icon?: ReactNode;
    color?: string;
    order?: number;
  };
}

// State-based mention provider configuration
// Based on: https://docs.cedarcopilot.com/agent-context/mentions
export interface StateBasedMentionProviderConfig {
  stateKey: string; // What state to allow users to mention
  trigger?: string; // Default '@'
  labelField?: string | ((item: unknown) => string); // How it should be labelled
  searchFields?: string[]; // What fields the user should be able to type to search
  description?: string;
  icon?: ReactNode;
  color?: string; // Hex color
  order?: number; // Order for display (lower numbers appear first)
  renderMenuItem?: (item: MentionItem) => ReactNode;
  renderEditorItem?: (item: MentionItem, attrs: Record<string, unknown>) => ReactNode;
  renderContextBadge?: (entry: ContextEntry) => ReactNode;
}

// Mention provider interface
export interface MentionProvider {
  trigger: string;
  getItems: (query: string) => Promise<MentionItem[]> | MentionItem[];
  toContextEntry: (item: MentionItem) => ContextEntry;
  renderMenuItem?: (item: MentionItem) => ReactNode;
  renderEditorItem?: (item: MentionItem, attrs: Record<string, unknown>) => ReactNode;
  renderContextBadge?: (entry: ContextEntry) => ReactNode;
}

// ---------------------------------------------
// Streaming Types (from Streaming)
// Based on: https://docs.cedarcopilot.com/chat/streaming
// ---------------------------------------------

// Streaming configuration
export interface StreamingConfig {
  enabled: boolean;
  provider?: 'mastra' | 'ai-sdk' | 'openai' | 'custom';
  fallbackToNonStreaming?: boolean;
}

// Server-Sent Events types for streaming
export interface SSEEvent {
  type: string;
  data: string;
  id?: string;
  retry?: number;
}

// Streaming event types
export type StreamingEventType =
  | 'start'
  | 'chunk'
  | 'complete'
  | 'error'
  | 'object'
  | 'custom';

// Streaming event interface
export interface StreamingEvent {
  type: StreamingEventType;
  data: unknown;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Streaming handler interface
// Based on: https://docs.cedarcopilot.com/chat/streaming
export interface StreamingHandler {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  onObject?: (object: unknown) => void;
}

// ---------------------------------------------
// State Diff Types (from State Diff Internals)
// Based on: https://docs.cedarcopilot.com/state-diff/state-diff-internals
// ---------------------------------------------

// JSON Patch operation for efficient diff tracking
export interface Operation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: unknown;
  from?: string;
}

// Diff state tracking current changes
export interface DiffState<T = unknown> {
  oldState: T; // The baseline state
  newState: T; // The proposed new state
  computedState: T; // The transformed state (with diff markers)
  isDiffMode: boolean; // Whether diffs are being tracked
  patches?: Operation[]; // JSON Patch operations describing changes
}

// Complete diff history for undo/redo support
export interface DiffHistoryState<T = unknown> {
  diffState: DiffState<T>; // Current diff state
  history: Array<DiffState<T>>; // Previous states for undo
  redoStack: Array<DiffState<T>>; // Future states for redo
  diffMode: DiffMode; // 'defaultAccept' or 'holdAccept'
  computeState?: ComputeStateFunction<T>; // Transform function
}

// Diff mode configuration
export type DiffMode = 'defaultAccept' | 'holdAccept';

// Compute state function for adding diff markers
// Based on: https://docs.cedarcopilot.com/state-diff/state-diff-internals
export type ComputeStateFunction<T = unknown> = (oldState: T, newState: T, patches: Operation[]) => T;

// Diff checker for selective diff tracking
export interface DiffChecker {
  type: 'ignore' | 'include';
  fields: string[]; // JSON paths to include/exclude
}

// ---------------------------------------------
// Legacy Compatibility Types (deprecated - use Cedar types above)
// ---------------------------------------------

// Generic message schema used by chat workflows (Cedar-compatible)
export const MessageSchema = z.object({
  content: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.string().optional(),
});

// Cedar LLM Response interface (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#basic-llm-responses
export const LLMResponseSchema = z.object({
  content: z.string().describe('The agent\'s text response'),
  usage: z.object({
    promptTokens: z.number().describe('Tokens used in the prompt'),
    completionTokens: z.number().describe('Tokens used in the completion'),
    totalTokens: z.number().describe('Total tokens used'),
  }).optional().describe('Token usage information'),
  metadata: z.record(z.string(), z.unknown()).optional().describe('Additional metadata'),
  object: z.any().optional().describe('Structured action response'), // Will be validated by specific action schemas
});

// Cedar Agentic Actions - SetState Response (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#setstateresponse
export const SetStateResponseSchema = z.object({
  type: z.literal('setState').describe('Action type for state manipulation'),
  stateKey: z.string().describe('Key of the state to modify'),
  setterKey: z.string().describe('Name of the state setter function to execute'),
  args: z.any().describe('Arguments to pass to the state setter'), // Single object parameter per Cedar v0.1.11+
});

// Cedar Agentic Actions - FrontendTool Response (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#frontendtoolresponse
export const FrontendToolResponseSchema = z.object({
  type: z.literal('frontendTool').describe('Action type for frontend tool execution'),
  toolName: z.string().describe('Name of the registered frontend tool to execute'),
  args: z.any().describe('Arguments to pass to the frontend tool'),
});

// Cedar Message Response for adding custom messages to chat
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#messageresponse
export const MessageResponseSchema = z.object({
  type: z.literal('message').describe('Action type for adding messages to chat'),
  role: z.enum(['user', 'assistant', 'bot']).optional().describe('Message role'),
  content: z.string().describe('Message content'),
});

// Progress update message type (built-in Cedar type)
export const ProgressUpdateResponseSchema = z.object({
  type: z.literal('progress_update').describe('Action type for progress indicators'),
  content: z.string().describe('Progress message content'),
  metadata: z.object({
    state: z.enum(['in_progress', 'complete', 'error']).optional().describe('Progress state'),
  }).optional().describe('Progress metadata'),
});

// Union of all Cedar action responses
export const ActionResponseSchema = z.union([
  SetStateResponseSchema,
  FrontendToolResponseSchema,
  MessageResponseSchema,
  ProgressUpdateResponseSchema,
]);

// Final agent response shape - matches Cedar's ExecuteFunctionResponseSchema
export const ExecuteFunctionResponseSchema = LLMResponseSchema;

// Legacy product roadmap specific types (kept for compatibility with product workflows)
const FeatureNodeDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['done', 'planned', 'backlog', 'in progress']).default('planned'),
  nodeType: z.literal('feature').default('feature'),
  upvotes: z.number().default(0),
  comments: z
    .array(
      z.object({
        id: z.string(),
        author: z.string(),
        text: z.string(),
      }),
    )
    .default([]),
});

const NodeSchema = z.object({
  id: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  data: FeatureNodeDataSchema,
});

export const AddNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('addNode'),
  args: z.array(NodeSchema),
});

export const RemoveNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('removeNode'),
  args: z.array(z.string()),
});

export const ChangeNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('changeNode'),
  args: z.array(NodeSchema),
});

// Legacy action schema (deprecated)
export const ActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.string(),
  setterKey: z.string(),
  args: z.array(z.any()),
});

// Legacy chat agent response (deprecated)
export const ChatAgentResponseSchema = z.object({
  content: z.string(),
  action: ActionSchema.optional(),
});

// Re-export types for convenience
export type Message = z.infer<typeof MessageSchema>;
export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type SetStateResponse = z.infer<typeof SetStateResponseSchema>;
export type FrontendToolResponse = z.infer<typeof FrontendToolResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type ProgressUpdateResponse = z.infer<typeof ProgressUpdateResponseSchema>;
export type ActionResponse = z.infer<typeof ActionResponseSchema>;
export type ExecuteFunctionResponse = z.infer<typeof ExecuteFunctionResponseSchema>;

// Legacy type exports (deprecated)
export type ChatAgentResponse = z.infer<typeof ChatAgentResponseSchema>;
