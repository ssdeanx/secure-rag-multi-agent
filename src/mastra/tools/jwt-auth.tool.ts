import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { AuthenticationService } from "../services/AuthenticationService";
import { log } from "../config/logger";

log.info('jwtAuthTool initialized');
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error(`JWT verification failed: ${errorMessage}`);
      throw new Error("JWT verification failed: Unknown error");
    }
  },
});
