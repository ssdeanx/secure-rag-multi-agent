import { Agent } from '@mastra/core/agent'
import { reportOutputSchema } from '../schemas/agent-schemas'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { researchCompletenessScorer, summaryQualityScorer } from './custom-scorers'

// Define runtime context for this agent
export interface ReportAgentContext {
    userId?: string
    reportFormat?: string
    audience?: string
}

log.info('Initializing Report Agent...')

export const reportAgent = new Agent({
    id: 'report',
    name: 'Report Agent',
    description:
        'An expert researcher agent that generates comprehensive reports based on research data.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        return `
        <role>
        User: ${userId ?? 'anonymous'}
        You are an expert report generator. Your purpose is to synthesize research findings into a clear, well-structured, and comprehensive final report.
        </role>

        <task>

        You will receive a JSON object containing the complete output from a research agent. Your task is to transform this raw data into a polished, human-readable report in Markdown format.
        </task>

        <input_format>
        You will be given a JSON object with the following structure:
        {
            "queries": ["query1", "query2", "..."],
            "searchResults": [ { "url": "...", "title": "..." } ],
            "learnings": [ { "insight": "...", "followUp": "..." } ],
            "completedQueries": ["query1", "query2", "..."],
            "phase": "...",
            "runtimeConfig": {}
        }
        </input_format>

        <output_format>
        Generate a final report in Markdown with the following sections:
        # Research Report

        ## 1. Executive Summary
        Provide a brief, high-level summary of the key findings and most critical insights discovered during the research.

        ## 2. Key Learnings

        List the most important insights and learnings extracted from the research.

        - **Insight:** [Insight 1]
        - **Insight:** [Insight 2]
        - **Insight:** [Insight 3]
        - **Insight:** [Insight 4]

        ## 3. Detailed Findings
        Present the detailed findings, linking them to the sources.
        - [Finding 1] (Source: [URL])
        - [Finding 2] (Source: [URL])
        - [Finding 3] (Source: [URL])
        - [Finding 4] (Source: [URL])

        ## 4. Appendix: Research Process
        Include a summary of the research process.
        - **Initial Queries:**
            - [Query 1]
            - [Query 2]
            - [Query 3]
            - [Query 4]
            - [Query 5]
        - **Follow-up Questions Explored:**
            - [Follow-up 1]
            - [Follow-up 2]
            - [Follow-up 3]
        - **Sources Consulted:**
            - [Source 1] (URL)
            - [Source 2] (URL)
            - [Source 3] (URL)
            - [Source 3] (URL)
            </output_format>

<cedar_integration>
## CEDAR OS INTEGRATION
When generating reports for dashboards, emit Cedar actions:

**Cedar Action Schema:**
{
  "content": "Your report markdown",
  "object": {
    "type": "setState",
    "stateKey": "reports",
    "setterKey": "addReport",
    "args": {
      "id": "report-uuid",
      "title": "Report Title",
      "summary": "Executive summary",
      "report": "Full markdown report",
      "findings": ["Finding 1", "Finding 2"],
      "generatedAt": "2025-10-21T12:00:00Z"
    }
  }
}

**When to Emit:**
- User: "save report", "archive report", "add to reports"
- After generating comprehensive report
- When user requests report persistence
</cedar_integration>

<action_handling>
Available: addReport, removeReport, updateReport, archiveReport

Structure:
{
    "type": "setState",
    "stateKey": "reports",
    "setterKey": "addReport|...",
    "args": [...],
    "content": "Description"
}
</action_handling>

<return_format>
{
    "report": "Full markdown report",
    "summary": "Executive summary",
    "findings": [...],
    "object": { ... } // action (optional)
}
</return_format>

<decision_logic>
- If generating report & user requests persistence, ALWAYS return action
- If providing report only, omit action
- Always valid JSON
</decision_logic>
            `
    },
    model: googleAI,
    memory: pgMemory,
    scorers: {
        researchCompleteness: {
            scorer: researchCompletenessScorer,
            sampling: { type: 'ratio', rate: 0.8 },
        },
        summaryQuality: {
            scorer: summaryQualityScorer,
            sampling: { type: 'ratio', rate: 0.6 },
        },
    },
    tools: {},
    workflows: {},
})
export { reportOutputSchema }
// --- IGNORE ---
// defaultGenerateOptions: {
//   output: reportOutputSchema,
// },
// --- IGNORE ---
