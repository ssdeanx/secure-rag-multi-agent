import { Agent } from '@mastra/core/agent'
import { productRoadmapOutputSchema } from '../schemas/agent-schemas'
import { log } from '../config/logger'
import { extractLearningsTool } from '../tools/extractLearningsTool'
import { editorTool } from '../tools/editor-agent-tool'
import { copywriterTool } from '../tools/copywriter-agent-tool'
import { evaluateResultTool } from '../tools/evaluateResultTool'
import { graphQueryTool, pgMemory, pgQueryTool } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { PGVECTOR_PROMPT } from '@mastra/pg'
import { mdocumentChunker } from '../tools/document-chunking.tool'
import { htmlToMarkdownTool, webScraperTool } from '../tools/web-scraper-tool'
import { vectorQueryTool } from '../tools/vector-query.tool'
import { promises as fs } from 'fs'
import path from 'path'
import { BatchPartsProcessor, UnicodeNormalizer } from '@mastra/core/processors'
import { GeminiLiveVoice } from '@mastra/voice-google-gemini-live'
import { playAudio, getMicrophoneStream } from '@mastra/node-audio'

const voiceConfig = new GeminiLiveVoice({
    speechModel: {
        name: 'gemini-2.5.flash-preview-tts',
        apiKey: process.env.GOOGLE_API_KEY,
    },
    speaker: 'Orus',
    realtimeConfig: {
        model: 'gemini-live-2.5-flash-preview',
        apiKey: process.env.GOOGLE_API_KEY,
        options: {
            debug: true,
            sessionConfig: {
                interrupts: { enabled: true },
                enableResumption: true,
                maxDuration: '1h',
            },
        },
    },
})

log.info('Initializing productRoadmap Agent...')

// Create RAG tools for interacting with the product roadmap graph database
export const productRoadmapAgent = new Agent({
    id: 'productRoadmap',
    name: 'Product Roadmap Agent',
    description:
        'Manages the product roadmap for the Cedar project, including features, priorities, and requests with enhanced content generation capabilities.',
    instructions: `
<role>
You are a helpful product roadmap assistant for the Cedar open source project. Cedar is a JavaScript library that provides tools for building interactive AI applications.
</role>

<primary_function>
Your primary function is to help users navigate the product roadmap, understand feature priorities, manage feature requests, and generate related content.
</primary_function>

<response_guidelines>
When responding:
- Be knowledgeable about the Cedar project's features and roadmap
- Help users find information about specific features
- Assist with creating new feature requests
- Help users vote on features they find important
- Allow users to comment on features
- Provide insights into feature relationships (parent/child features)
- Be concise but informative in your responses
- Format your responses in a clear, readable way
- When listing features, include their ID, title, status, and priority
- When showing feature details, include all relevant information including votes and comments
- Leverage content creation tools for generating feature descriptions, documentation, and communications
- Use editing tools to improve feature descriptions and documentation
</response_guidelines>

<roadmap_structure>
The product roadmap is structured as a tree of features, where some features have parent-child relationships.
</roadmap_structure>

<feature_statuses>
Available feature statuses:
- planned: Features that are planned but not yet started
- in-progress: Features currently being worked on
- completed: Features that have been finished
- cancelled: Features that were planned but later cancelled
</feature_statuses>

<feature_priorities>
Available feature priorities:
- low: Nice-to-have features
- medium: Important but not urgent features
- high: Important features that should be prioritized
- critical: Must-have features that are top priority
</feature_priorities>

<tool_usage>
Use the provided tools to interact with the product roadmap database.

Content Creation Tools:
- Use copywriterTool for creating feature descriptions, documentation, release notes, and communications
- Specify contentType (blog, marketing, technical, business, social, creative, general) based on the context
- Use editorTool for improving existing feature descriptions, documentation, and content
- Specify contentType and tone when using these tools for best results

When creating content:
- For feature announcements: Use marketing contentType with engaging tone
- For technical documentation: Use technical contentType with professional tone
- For user communications: Use business contentType with clear, professional tone
- For social media updates: Use social contentType with engaging tone
- ${PGVECTOR_PROMPT}
</tool_usage>

<content_generation>
You can generate various types of content related to roadmap features:

Feature Documentation:
- Technical specifications using technical contentType
- User-facing descriptions using marketing contentType
- Implementation guides using technical contentType

Communications:
- Release announcements using marketing contentType
- Status updates using business contentType
- Social media posts using social contentType

Content Improvement:
- Edit existing feature descriptions for clarity
- Improve documentation readability
- Enhance user-facing content
- Polish communications before publishing
</content_generation>

<action_handling>
When users ask you to modify the roadmap, you should return structured actions.

Available actions:
1. addNode - Add a new feature node to the roadmap
2. removeNode - Remove a feature node by ID
3. changeNode - Update an existing feature node

When returning an action, use this exact structure:
{
    "type": "setState",
    "stateKey": "nodes",
    "setterKey": "addNode" | "removeNode" | "changeNode",
    "args": [appropriate arguments],
    "content": "A human-readable description of what you did"
}

For addNode, args should be: [{data: { title, description, status, nodeType: "feature", upvotes: 0, comments: [] }}]
For removeNode, args should be: ["nodeId"]
For changeNode, args should be: [{ id: "nodeId", data: { ...updated fields } }]
</action_handling>

<return_format>
You should always return a JSON object with the following structure:
{
    "content": "Your response",
    "object": { ... } // action schema from above (optional, omit if not modifying the roadmap)
}

When generating content, include the generated content in your response and indicate which tools were used.
</return_format>

<decision_logic>
- If the user is asking to modify the roadmap, ALWAYS return an action.
- If the user is asking a question or making a comment, return a message.
- If the user is just asking a question or making a comment, return only the content and omit the action, like this:
{
    "content": "Your response"
}
</decision_logic>
    `,
    model: googleAI,
    memory: pgMemory,
    tools: {
        extractLearningsTool,
        editorTool,
        copywriterTool,
        evaluateResultTool,
        pgQueryTool,
        graphQueryTool,
        mdocumentChunker,
        webScraperTool,
        htmlToMarkdownTool,
        vectorQueryTool,
    },
    inputProcessors: [
        new UnicodeNormalizer({
            stripControlChars: true,
            collapseWhitespace: true,
            preserveEmojis: true,
            trim: true,
        }),
    ],
    outputProcessors: [
        new BatchPartsProcessor({
            batchSize: 30, // Maximum parts to batch together
            maxWaitTime: 50, // Maximum time to wait before emitting (ms)
            emitOnNonText: true, // Emit immediately on non-text parts
        }),
    ],
    evals: {
        // Add any evaluation metrics if needed
    },
    scorers: {},
    workflows: {},
    voice: voiceConfig,
})
export { productRoadmapOutputSchema }

// Establish connection (required before using other methods)
async function main() {
  // Establish connection (required before using other methods)
  await voiceConfig.connect();
  // Set up event listeners
  voiceConfig.on("speaker", (audioStream) => {
    // Handle audio stream (NodeJS.ReadableStream)
    playAudio(audioStream);
  });
  voiceConfig.on("writing", ({ text, role }) => {
    // Handle transcribed text
    log.info(`${role}: ${text}`);
  });
  voiceConfig.on("turnComplete", ({ timestamp }) => {
    // Handle turn completion
    log.info("Turn completed at:", { timestamp });
  });
  // Convert text to speech
  await voiceConfig.speak("Hello, how can I help you today?", {
  //  speaker: "Charon", // Override default voice
    responseModalities: ["AUDIO", "TEXT"],
  });
}
main().catch((err) => {
  log.error("Error in voice setup:", err);
});
// Process audio input
const microphoneStream = getMicrophoneStream();
await voiceConfig.send(microphoneStream);

// Update session configuration
await voiceConfig.updateSessionConfig({
    speaker: 'Kore',
    instructions: 'Be more concise in your responses',
})
// Save session handle for resumption
voiceConfig.on('sessionHandle', ({ handle, expiresAt }) => {
    // Store session handle for resumption
    saveSessionHandle(handle, expiresAt)
})
// When done, disconnect
await voiceConfig.disconnect()
// Or use the synchronous wrapper
voiceConfig.close()

// Ensure a small .mastra directory exists in the project root.
// Reads the existing session-handles file (if any), prunes expired handles, adds/updates the incoming handle with ISO expiration, and writes the file back.
// Logs success or error using the existing log utility.
// Keeps the API simple (Promise<void>) so existing callers that don't await the result continue to work.
async function saveSessionHandle(
    handle: string,
    expiresAt: Date
): Promise<void> {
    const dataDir = path.join(process.cwd(), '.mastra')
    const filePath = path.join(dataDir, 'session-handles.json')

    // Helper type-guard for Node-style errors that may have a `code` property.
    function isErrnoLike(e: unknown): e is { code?: unknown } {
        return typeof e === 'object' && e !== null && 'code' in e
    }

    try {
        // Ensure storage directory exists
        await fs.mkdir(dataDir, { recursive: true })

        // Load existing handles (if present)
        let existing: Record<string, string> = {}
        try {
            const raw = await fs.readFile(filePath, 'utf8')
            existing = JSON.parse(raw) as Record<string, string>
        } catch (err: unknown) {
            // Only ignore "file not found" (ENOENT). Re-throw other errors.
            if (isErrnoLike(err) && (err.code as string) === 'ENOENT') {
                // ENOENT is fine — we'll create the file below
            } else {
                throw err
            }
        }

        const now = new Date()
        // Prune expired handles
        for (const [h, iso] of Object.entries(existing)) {
            try {
                if (new Date(iso) <= now) {
                    delete existing[h]
                }
            } catch {
                delete existing[h] // malformed entry: remove it
            }
        }

        // Add/update the incoming handle
        existing[handle] = expiresAt.toISOString()

        // Persist back to disk
        await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8')

        log.info('Saved voice session handle', {
            handle,
            expiresAt: expiresAt.toISOString(),
            file: filePath,
        })
    } catch (error) {
        // Safely extract error message without using `any`
        const message = error instanceof Error ? error.message : String(error)
        log.error('Failed to save session handle', {
            error: message,
            handle,
            expiresAt,
        })
    }
}
