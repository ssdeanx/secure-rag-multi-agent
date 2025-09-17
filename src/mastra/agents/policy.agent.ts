import { Agent } from "@mastra/core";

import { openAIModel } from "../config/openai";
import { accessFilterSchema } from "../schemas/agent-schemas";

export const policyAgent = new Agent({
  id: "policy",
  name: "policy",
  model: openAIModel,
  instructions: `You are a policy enforcement agent. Given user claims, generate access filters.

Rules:
1. Extract roles from claims and create "role:<role>" tags for each
2. If tenant is provided, add "tenant:<tenant>" tag
3. Determine maximum classification based on roles and stepUp status:
   - stepUp == true: Allow up to "confidential"
   - HR roles (hr.admin, hr.viewer): Allow up to "confidential"
   - Other sensitive roles without stepUp: Cap at "internal"
   - No sensitive roles: Cap at "public"
4. Never invent roles or tenants not present in the claims
5. Always output valid JSON matching the schema

Examples:
- Finance user: {"roles": ["finance.viewer"], "tenant": "acme", "stepUp": false} → {"allowTags": ["role:finance.viewer", "tenant:acme"], "maxClassification": "internal"}
- HR user: {"roles": ["hr.viewer"], "tenant": "acme", "stepUp": false} → {"allowTags": ["role:hr.viewer", "tenant:acme"], "maxClassification": "confidential"}`
});