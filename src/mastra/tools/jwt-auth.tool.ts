import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { AISpanType } from '@mastra/core/ai-tracing';
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
  execute: async ({ context, tracingContext }) => {
    // Create a span for tracing
    const span = tracingContext?.currentSpan?.createChildSpan({
      type: AISpanType.TOOL_CALL,
      name: 'jwt-auth-tool',
      input: { hasJwt: !!context.jwt }
    });

    try {
      const result = await AuthenticationService.verifyJWT(context.jwt);
      span?.end({ output: { success: true, hasRoles: result.roles?.length > 0 } });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error(`JWT verification failed: ${errorMessage}`);
      span?.error({ error: new Error(errorMessage) });
      throw new Error("JWT verification failed: Unknown error");
    }
  },
});
