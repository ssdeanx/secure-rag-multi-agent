import { Agent } from "@mastra/core";

import { openAIModel } from "../config/openai";
import { jwtClaimsSchema } from "../schemas/agent-schemas";
import { jwtAuthTool } from "../tools/jwt-auth.tool";
import { createResearchMemory } from '../config/libsql-storage';
import z from "zod";
import { google } from "@ai-sdk/google";
import { logger } from "../config/logger";

logger.info('Initializing Identity Agent...');

const memory = createResearchMemory();

export const identityAgent = new Agent({
  id: "identity",
  name: "identity",
  model: google('gemini-2.5-flash-lite'),
  description: "An identity extraction agent that extracts user claims from a JWT token.",
  instructions: `You are an identity extraction agent. Your task is to:
1. Call the jwt-auth tool with the provided JWT token
2. Return the extracted claims in the exact format received
3. If the JWT is invalid or expired, return an error message

Always use the jwt-auth tool - never attempt to decode JWTs manually.`,
  tools: { jwtAuth: jwtAuthTool },
  memory,
  evals: {
    // Add any evaluation metrics if needed
  },
});

export const identityOutputSchema = jwtClaimsSchema.extend({
  error: z.string().optional()
});
