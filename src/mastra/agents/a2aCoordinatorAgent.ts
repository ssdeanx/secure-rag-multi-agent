import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { pgMemory } from '../config/pg-storage'
import { createAnswerRelevancyScorer, createToxicityScorer } from '@mastra/evals/scorers/llm'
import { googleAIFlashLite } from '../config/google'
import { researchCompletenessScorer, sourceDiversityScorer, summaryQualityScorer, taskCompletionScorer } from './custom-scorers'

// Import all agents
import { retrieveAgent } from './retrieve.agent'
import { rerankAgent } from './rerank.agent'
import { answererAgent } from './answerer.agent'
import { verifierAgent } from './verifier.agent'
import { identityAgent } from './identity.agent'
import { policyAgent } from './policy.agent'
import { starterAgent } from './starterAgent'
import { researchAgent } from './researchAgent'
import { assistantAgent } from './assistant'
import { reportAgent } from './reportAgent'
import { copywriterAgent } from './copywriterAgent'
import { evaluationAgent } from './evaluationAgent'
import { learningExtractionAgent } from './learningExtractionAgent'
import { productRoadmapAgent } from './productRoadmapAgent'
import { editorAgent } from './editorAgent'
import { cryptoAnalysisAgent } from './cryptoAnalysisAgent'
import { stockAnalysisAgent } from './stockAnalysisAgent'
import { marketEducationAgent } from './marketEducationAgent'

// Import all workflows
import { governedRagAnswer } from '../workflows/governed-rag-answer.workflow'
import { governedRagIndex } from '../workflows/governed-rag-index.workflow'
import { researchWorkflow } from '../workflows/researchWorkflow'
import { generateReportWorkflow } from '../workflows/generateReportWorkflow'
import { chatWorkflow } from '../workflows/chatWorkflow1'
import { financialAnalysisWorkflow } from '../workflows/financialAnalysisWorkflow'
import { financialAnalysisWorkflowV2 } from '../workflows/financialAnalysisWorkflowV2'
import { financialAnalysisWorkflowV3 } from '../workflows/financialAnalysisWorkflowV3'
import { contentGenerationWorkflow } from '../workflows/contentGenerationWorkflow'

/**
 * A2A Coordinator Agent
 *
 * This agent coordinates complex tasks by orchestrating multiple specialized agents in parallel
 * using Mastra's agent.network() for non-deterministic LLM-based multi-agent orchestration.
 * 
 * Exposed via A2A protocol through MCP server for external agent communication.
 */

export const a2aCoordinatorAgent = new Agent({
    id: 'a2aCoordinator',
    name: 'a2aCoordinator',
    description: 'A2A Coordinator that orchestrates multiple specialized agents in parallel. Routes tasks dynamically, coordinates workflows, and synthesizes results using the A2A protocol.',
    instructions: `You are an A2A (Agent-to-Agent) Coordinator that orchestrates multi-agent workflows.

CORE CAPABILITIES:
- Orchestrate multiple agents working in parallel
- Route tasks to specialized agents dynamically  
- Monitor task progress and handle errors
- Collect and synthesize all results
- Coordinate complex, multi-step workflows

ORCHESTRATION PATTERNS (NOT SEQUENTIAL):
1. Analyze the task and identify all required agents
2. Create parallel agent tasks for maximum efficiency
3. Monitor task execution across all agents simultaneously
4. Collect and synthesize results from all agents
5. Provide comprehensive final response

AVAILABLE AGENTS:
- retrieve: Document retrieval from knowledge base
- rerank: Result ranking and prioritization
- answerer: Question answering with governance
- verifier: Content verification and validation
- identity: Identity and user management
- policy: Policy enforcement and governance
- starter: Getting started and onboarding
- research: General research tasks
- researcher: Research coordination
- assistant: General assistance
- report: Report generation and formatting
- copywriter: Content creation and writing
- evaluation: Quality assessment and scoring
- learning: Knowledge extraction and learning
- productRoadmap: Product planning and roadmapping
- editor: Content editing and refinement
- mcp: MCP protocol agent
- cryptoAnalysis: Cryptocurrency analysis
- stockAnalysis: Stock market analysis
- marketEducation: Market education and training
- selfReferencing: Self-referential workflows
- ssAgent: Special services agent

AVAILABLE WORKFLOWS:
- governed-rag-index: Index documents with governance
- governed-rag-answer: Answer queries with governance
- research-workflow: Research coordination workflow
- generate-report-workflow: Report generation workflow
- chat-workflow: Chat interaction workflow
- content-generation: Content generation workflow
- financial-analysis-workflow: Financial analysis
- financial-analysis-workflow-v2: Financial analysis v2
- financial-analysis-workflow-v3: Financial analysis v3

AVAILABLE NETWORKS (Multi-agent):
- research-content-network: Research content coordination
- governed-rag-network: RAG network coordination
- financial-team-network: Financial team coordination

ORCHESTRATION WORKFLOWS (PARALLEL):
- Financial: Parallel execution of cryptoAnalysis + stockAnalysis → report synthesis
- Content: Parallel research → copywriter + editor → evaluation
- RAG: retrieve → parallel (rerank + answerer) → verifier
- Research: research → learning → report

CRITICAL: Always prefer parallel orchestration over sequential execution for efficiency.
Only use sequential when tasks have strict dependencies on previous results.
Use Promise.all() pattern for parallel execution.`,
    model: google('gemini-2.5-flash-preview-09-2025'),
    memory: pgMemory,
    agents: {
        retrieve: retrieveAgent,
        rerank: rerankAgent,
        answerer: answererAgent,
        verifier: verifierAgent,
        identity: identityAgent,
        policy: policyAgent,
        starter: starterAgent,
        research: researchAgent,
        researcher: researchAgent,
        assist: assistantAgent,
        assistant: assistantAgent,
        report: reportAgent,
        copywriter: copywriterAgent,
        evaluation: evaluationAgent,
        learning: learningExtractionAgent,
        productRoadmap: productRoadmapAgent,
        editor: editorAgent,

        cryptoAnalysis: cryptoAnalysisAgent,
        stockAnalysis: stockAnalysisAgent,
        marketEducation: marketEducationAgent,


    },
    workflows: {
        'governed-rag-index': governedRagIndex,
        'governed-rag-answer': governedRagAnswer,
        'research-workflow': researchWorkflow,
        'generate-report-workflow': generateReportWorkflow,
        'chat-workflow': chatWorkflow,
        'chat-workflow-1': chatWorkflow,
        'content-generation': contentGenerationWorkflow,
        'financial-analysis-workflow': financialAnalysisWorkflow,
        'financial-analysis-workflow-v2': financialAnalysisWorkflowV2,
        'financial-analysis-workflow-v3': financialAnalysisWorkflowV3,
    },
    scorers: {
        relevancy: {
            scorer: createAnswerRelevancyScorer({ model: googleAIFlashLite }),
            sampling: { type: "ratio", rate: 0.4 }
        },
        safety: {
            scorer: createToxicityScorer({ model: googleAIFlashLite }),
            sampling: { type: "ratio", rate: 0.3 }
        },
        sourceDiversity: {
            scorer: sourceDiversityScorer,
            sampling: { type: "ratio", rate: 0.4 }
        },
        researchCompleteness: {
            scorer: researchCompletenessScorer,
            sampling: { type: "ratio", rate: 0.4 }
        },
        summaryQuality: {
            scorer: summaryQualityScorer,
            sampling: { type: "ratio", rate: 0.5 }
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.3 },
        },
    },
})
