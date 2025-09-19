import { z } from 'zod';

/**
 * Type definitions for chat workflow
 *
 * Define any custom schemas and types that your chat workflow needs.
 * This file can be extended with action schemas, response formats, etc.
 */

// Example: Basic message schema
export const MessageSchema = z.object({
  content: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.string().optional(),
});

// Action schemas
export const ActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.string(),
  setterKey: z.string(),
  args: z.array(z.any()),
});

export const ChatAgentResponseSchema = z.object({
  content: z.string(),
  action: ActionSchema.optional(),
});

// TODO: Add your custom workflow types and schemas here
// Examples:
// - Structured output schemas for your agent
// - Action types for UI state management
// - Custom response formats
// - Validation schemas for user inputs
