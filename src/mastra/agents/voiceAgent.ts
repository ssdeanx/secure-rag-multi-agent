import { Agent } from '@mastra/core/agent'

import { evaluateResultTool } from '../tools/evaluateResultTool'
import { extractLearningsTool } from '../tools/extractLearningsTool'
import {
    webScraperTool,
    batchWebScraperTool,
    siteMapExtractorTool,
    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool,
} from '../tools/web-scraper-tool'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { GeminiLiveVoice } from "@mastra/voice-google-gemini-live";
import { playAudio, getMicrophoneStream } from "@mastra/node-audio";

log.info('Voice Research Agent...')

export const voiceAgent = new Agent({
    id: 'voice',
    name: 'Voice Agent',
    description:
        'An expert voice agent that can interact with users via voice, understand their requests, and perform actions.',
    instructions: `
<role>
User:
You are an expert voice agent. Your goal is to assist users through voice interactions, understanding their requests, and performing actions accordingly.
</role>

<process_phases>
**PHASE 1: Initial Research**
1. Deconstruct the main topic into 2 specific, focused search queries.
2. For each query, use the \`webSearchTool\` to find information.
3. For each result, use the \`evaluateResultTool\` to determine relevance.
4. For all relevant results, use the \`extractLearningsTool\` to get key insights and generate follow-up questions.

**PHASE 2: Follow-up Research**
1. After Phase 1 is complete, gather ALL follow-up questions from the extracted learnings.
2. For each follow-up question, execute a new search with \`webSearchTool\`.
3. Use \`evaluateResultTool\` and \`extractLearningsTool\` on these new results.
4. **CRITICAL: STOP after this phase. Do NOT create a third phase by searching the follow-up questions from Phase 2.**
</process_phases>

<rules>
- Keep search queries focused and specific. Avoid overly general terms.
- Meticulously track all completed queries to avoid redundant searches.
- The research process concludes after the single round of follow-up questions.
- If all web searches fail, use your internal knowledge to provide a basic summary, but state that web access failed.
</rules>

<output_format>
CRITICAL: You must return the final findings in a single, valid JSON object. Do not add any text outside of the JSON structure.

Example:
{
  "queries": ["initial query 1", "initial query 2", "follow-up question 1"],
  "searchResults": [ { "url": "...", "title": "..." } ],
  "learnings": [ { "insight": "...", "followUp": "..." } ],
  "completedQueries": ["initial query 1", "initial query 2", "follow-up question 1"],
  "phase": "follow-up",
  "runtimeConfig": {}
}
</output_format>
  `,
    model: googleAI,
    tools: {
        webScraperTool,
        batchWebScraperTool,
        siteMapExtractorTool,
        linkExtractorTool,
        htmlToMarkdownTool,
        contentCleanerTool,
        evaluateResultTool,
        extractLearningsTool,
    },
    memory: pgMemory,
    voice: new GeminiLiveVoice({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-live-2.5-flash-preview-native-audio',
    speaker: 'Kore',
    debug: true,
    instructions: `You are an expert voice agent. Your goal is to assist users through voice interactions, understanding their requests, and performing actions accordingly.`,
    tools: [],
    sessionConfig: {enableResumption: true, contextCompression: true, maxDuration: '30m' }, // 30 minutes
    audioConfig: {
        inputSampleRate: 16000,
        outputSampleRate: 24000,
        encoding: 'pcm24',
        channels: 1,
    },
    // Vertex AI option:
    // vertexAI: true,
    // project: 'your-gcp-project',
    // location: 'us-central1',
    // serviceAccountKeyFile: '/path/to/service-account.json',
    }),
})

// Replace static and inconsistent usage with instance-guarded calls:
await voiceAgent.voice.connect();

voiceAgent.voice.on('speaker', (audio) => {
    playAudio(audio);
});

voiceAgent.voice.on('writing', ({ role, text }) => {
    log.debug(`${role}: ${text}`);
});

await voiceAgent.voice.speak('How can I help you today?');

const micStream = getMicrophoneStream(); // Assuming getMicrophoneStream is defined elsewhere
await voiceAgent.voice.send(micStream);

