import { Agent } from "@mastra/core";

import { openAIModel } from "../config/openai";
import { jwtClaimsSchema } from "../schemas/agent-schemas";
import { jwtAuthTool } from "../tools/jwt-auth.tool";

export const identityAgent = new Agent({
  id: "identity",
  name: "identity",
  model: openAIModel,
  instructions: `You are an identity extraction agent. Your task is to:
1. Call the jwt-auth tool with the provided JWT token
2. Return the extracted claims in the exact format received
3. If the JWT is invalid or expired, return an error message

Always use the jwt-auth tool - never attempt to decode JWTs manually.`,
  tools: { jwtAuth: jwtAuthTool }
});