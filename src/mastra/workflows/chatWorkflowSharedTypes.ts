import { z } from 'zod';

// Generic message schema used by chat workflows
export const MessageSchema = z.object({
  content: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.string().optional(),
});

// Generic action schema (suitable for UI state updates / commands)
export const ActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.string(),
  setterKey: z.string(),
  args: z.array(z.any()),
});

// Chat agent response shape used by streaming/experimental output
export const ChatAgentResponseSchema = z.object({
  content: z.string(),
  action: ActionSchema.optional(),
});

// --- Product roadmap specific types (kept for compatibility with product workflows) ---
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

const AddNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('addNode'),
  args: z.array(NodeSchema),
});

const RemoveNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('removeNode'),
  args: z.array(z.string()),
});

const ChangeNodeActionSchema = z.object({
  type: z.literal('setState'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('changeNode'),
  args: z.array(NodeSchema),
});

export const ActionResponseSchema = z.union([
  AddNodeActionSchema,
  RemoveNodeActionSchema,
  ChangeNodeActionSchema,
]);

export const ExecuteFunctionResponseSchema = z.object({
  content: z.string(),
  object: ActionResponseSchema.optional(),
});

// Re-export types for convenience
export type Message = z.infer<typeof MessageSchema>;
export type ChatAgentResponse = z.infer<typeof ChatAgentResponseSchema>;
