import { Agent } from "@mastra/core/agent";
import { createResearchMemory } from '../config/libsql-storage';
import { google } from '@ai-sdk/google';
import { log } from "../config/logger";

log.info('Initializing Editor Agent...');

const memory = createResearchMemory();
export const editorAgent = new Agent({
  id: "editor",
  name: "Editor",
  description: 'An editor agent that edits blog post copy to improve clarity, coherence, and overall quality.',
  instructions: "You are an editor agent that edits blog post copy.",
  model: google('gemini-2.5-flash-lite'),
  memory
});
