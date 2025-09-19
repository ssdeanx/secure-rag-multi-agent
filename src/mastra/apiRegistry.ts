import { registerApiRoute } from '@mastra/core/server';
import type { ChatOutput} from './workflows/chatWorkflow';
import { ChatInputSchema, chatWorkflow } from './workflows/chatWorkflow';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createSSEStream } from '../utils/streamUtils';
import { logger } from "./config/logger";

// Helper function to convert Zod schema to OpenAPI schema
function toOpenApiSchema(schema: Parameters<typeof zodToJsonSchema>[0]) {
  return zodToJsonSchema(schema) as Record<string, unknown>;
}

/**
 * API routes for the Mastra backend
 *
 * These routes handle chat interactions between the Cedar-OS frontend
 * and your Mastra agents. The chat UI will automatically use these endpoints.
 *
 * - /chat: Standard request-response chat endpoint
 * - /chat/stream: Server-sent events (SSE) endpoint for streaming responses
 */
export const apiRoutes = [
  registerApiRoute('/chat', {
    method: 'POST',
    openapi: {
      requestBody: {
        content: {
          'application/json': {
            schema: toOpenApiSchema(ChatInputSchema),
          },
        },
      },
    },
    handler: async (c) => {
      try {
        const body = await c.req.json();
        const { prompt, temperature, maxTokens, systemPrompt } = ChatInputSchema.parse(body);

        const run = await chatWorkflow.createRunAsync();
        const result = await run.start({
          inputData: { prompt, temperature, maxTokens, systemPrompt },
        });

        if (result.status === 'success') {
          // TODO: Add any response transformation or logging here
          logger.info('Sending response', { response: result.result });
          return c.json<ChatOutput>(result.result);
        }

        // TODO: Handle other workflow statuses if needed
        throw new Error('Workflow did not complete successfully');
      } catch (error) {
        logger.error('Chat API error', { error: error instanceof Error ? error.message : String(error) });
        return c.json({ error: error instanceof Error ? error.message : 'Internal error' }, 500);
      }
    },
  }),
  registerApiRoute('/chat/stream', {
    method: 'POST',
    openapi: {
      requestBody: {
        content: {
          'application/json': {
            schema: toOpenApiSchema(ChatInputSchema),
          },
        },
      },
    },
    handler: async (c) => {
      try {
        const body = await c.req.json();
        const { prompt, temperature, maxTokens, systemPrompt } = ChatInputSchema.parse(body);

        return createSSEStream(async (controller) => {
          const run = await chatWorkflow.createRunAsync();
          const result = await run.start({
            inputData: {
              prompt,
              temperature,
              maxTokens,
              systemPrompt,
              streamController: controller,
            },
          });

          if (result.status !== 'success') {
            // TODO: Handle workflow errors appropriately
            logger.error(`Workflow failed: ${result.status}`);
          }
        });
      } catch (error) {
        logger.error('Chat stream API error', { error: error instanceof Error ? error.message : String(error) });
        return c.json({ error: error instanceof Error ? error.message : 'Internal error' }, 500);
      }
    },
  }),
];
