import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { AuthenticationService } from "../services/AuthenticationService";
import { logger } from "../config/logger";

logger.info
export const jwtAuthTool = createTool({
  id: "jwt-auth",
  description: "Verify JWT and return claims (roles, tenant, stepUp)",
  inputSchema: z.object({ jwt: z.string() }),
  outputSchema: z.object({
    sub: z.string(),
    roles: z.array(z.string()),
    tenant: z.string().optional(),
    stepUp: z.boolean().optional(),
    exp: z.number().optional(),
    iat: z.number().optional(),
  }),
  execute: async ({ context }) => {
    try {
      return await AuthenticationService.verifyJWT(context.jwt);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`JWT verification failed: ${error.message}`);
      }
      throw new Error("JWT verification failed: Unknown error");
    }
  },
});
