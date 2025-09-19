import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { log } from "../config/logger";

log.info('Initializing Starter Agent...');

/**
 * Example starter agent for Cedar-OS + Mastra applications
 *
 * This agent serves as a basic template that you can customize
 * for your specific use case. Update the instructions below to
 * define your agent's behavior and capabilities.
 */
export const starterAgent = new Agent({
  id: 'starter',
  name: 'Starter Agent',
  description: 'A basic starter agent that assists users with general questions and tasks.',
  instructions: `
<role>
You are a helpful AI assistant. Your primary function is to assist users with their questions and tasks.
</role>

<primary_function>
Your primary function is to help users navigate the product roadmap, understand feature priorities, and manage feature requests.
</primary_function>

<response_guidelines>
When responding:
- Be helpful, accurate, and concise
- Format your responses in a clear, readable way
- Use the tools available to you when appropriate
</response_guidelines>

<response_format>
You will respond in a JSON format with the following fields:
{
  "content": "The response to the user's question or task"
}
</response_format>
  `,
  model: google('gemini-2.5-flash'),
  // TODO: Add any tools your agent needs by passing them in the tools array
  // tools: [tool1, tool2, ...],
});
