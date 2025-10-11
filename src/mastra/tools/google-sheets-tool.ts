import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import Arcade from "@arcadeai/arcadejs";
import { log } from "../config/logger";

interface ToolConfig {
  arcadeApiKey?: string | undefined;
  arcadeUserId?: string | undefined;
  defaultSpreadsheetId?: string | undefined;
}

export const googleSheetsTool = ({ arcadeApiKey, arcadeUserId, defaultSpreadsheetId }: ToolConfig) => {
  // Validate required parameters
  if (!arcadeApiKey || arcadeApiKey.trim() === '') {
    throw new Error("ARCADE_API_KEY is required but not provided or is empty");
  }

  if (!arcadeUserId || arcadeUserId.trim() === '') {
    throw new Error("ARCADE_USER_ID is required but not provided or is empty");
  }

  if (!defaultSpreadsheetId || defaultSpreadsheetId.trim() === '') {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is required but not provided or is empty");
  }

  return createTool({
    id: "get_google_spreadsheet",
    description: "Fetch data from a Google Spreadsheet using Arcade AI",
    inputSchema: z.object({
        spreadsheet_id: z.string().optional().describe("The ID of the Google Spreadsheet, Omitting this would use the default spreadsheet"),
    }).optional().describe("No Input Parameters Needed for this tool, just an empty JSON object would suffice"),
    outputSchema: z.object({
      data: z.any().describe("The spreadsheet data"),
      success: z.boolean().describe("Whether the operation was successful"),
      error: z.string().optional().describe("Error message if any"),
    }),
    execute: async ({ context  }) => {
      const finalSpreadsheetId = context?.spreadsheet_id ?? defaultSpreadsheetId;

      // Runtime validation for spreadsheet ID
      if (!finalSpreadsheetId || finalSpreadsheetId.trim() === '') {
        return {
          data: null,
          success: false,
          error: "Spreadsheet ID is required but not provided",
        };
      }

      try {
        const client = new Arcade({
            "apiKey": arcadeApiKey,
        });

        // Check if the tool is already authorized
        try {
          // Try to execute directly first to check if already authorized
          const testResult = await client.tools.execute({
            tool_name: "GoogleSheets.GetSpreadsheet@3.0.0",
            input: {
              spreadsheet_id: finalSpreadsheetId,
            },
            user_id: arcadeUserId,
          });

          return {
            data: testResult,
            success: true,
          };
        } catch (error: any) {
          // If execution fails, we might need authorization
          if (error.message?.includes("authorization") || error.message?.includes("auth")) {
            log.info("Tool needs authorization, starting auth flow...");

            // Authorize the tool
            const auth = await client.tools.authorize({
              tool_name: "GoogleSheets.GetSpreadsheet@3.0.0",
              user_id: arcadeUserId,
            });

            // Check if authorization is completed
            if (auth?.status !== "completed") {
              log.info(`Click here to authorize the tool: ${auth?.url}`);

              // Wait for authorization to complete
              const { status } = await client.auth.waitForCompletion(auth);

              if (status !== "completed") {
                return {
                  data: null,
                  success: false,
                  error: "Authorization failed or timed out",
                };
              }

              log.info("🚀 Authorization successful!");
            }

            // Now try to execute the tool again
            const result = await client.tools.execute({
              tool_name: "GoogleSheets.GetSpreadsheet@3.0.0",
              input: {
                spreadsheet_id: finalSpreadsheetId,
              },
              user_id: arcadeUserId,
            });

            return {
              data: result,
              success: true,
            };
          } else {
            // Some other error occurred
            throw error;
          }
        }
      } catch (error: any) {
        log.error("Error fetching Google Spreadsheet:", error);
        return {
          data: null,
          success: false,
          error: error.message ?? "Unknown error occurred",
        };
      }
    },
  });
};
