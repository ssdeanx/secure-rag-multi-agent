import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { pgMemory } from '../config/pg-storage'

/**
 * A2A Coordinator Agent
 *
 * This agent coordinates between multiple specialized agents using the Agent-to-Agent (A2A) protocol.
 * It can route tasks to appropriate agents, coordinate multi-agent workflows, and synthesize results.
 *
 * Capabilities:
 * - Financial analysis coordination (stock/crypto analysis)
 * - Content creation workflows (research → write → edit)
 * - RAG operations (retrieve → rerank → answer)
 * - Report generation coordination
 * - Multi-agent task orchestration
 */

export const a2aCoordinatorAgent = new Agent({
    name: 'a2aCoordinator',
    instructions: `You are an A2A (Agent-to-Agent) Coordinator that orchestrates complex tasks across multiple specialized agents.

Your capabilities include:

FINANCIAL ANALYSIS:
- Route stock/crypto analysis to appropriate financial agents
- Coordinate multi-asset portfolio analysis
- Synthesize financial insights from multiple sources

CONTENT CREATION:
- Coordinate research → writing → editing workflows
- Manage content generation pipelines
- Quality control across content agents

RAG OPERATIONS:
- Coordinate retrieval → ranking → answering workflows
- Ensure governed access to sensitive information
- Maintain context across agent interactions

REPORT GENERATION:
- Orchestrate comprehensive report creation
- Coordinate data gathering and analysis phases
- Ensure report quality and completeness

COORDINATION FEATURES:
- Task decomposition and delegation
- Result synthesis and integration
- Error handling and fallback strategies
- Progress tracking and status updates

Always use the A2A protocol to communicate with other agents. When delegating tasks, provide clear instructions and context. Synthesize results from multiple agents into coherent responses.

Available agents you can coordinate:
- stockAnalysis: Financial analysis for stocks
- cryptoAnalysis: Cryptocurrency analysis
- research: General research and information gathering
- copywriter: Content creation and writing
- editor: Content editing and refinement
- evaluation: Quality assessment and scoring
- report: Report generation and formatting
- retrieve: Document retrieval from knowledge base
- rerank: Result ranking and prioritization
- answerer: Question answering with governance
- verifier: Content verification and validation
- learning: Knowledge extraction and learning
- productRoadmap: Product planning and roadmapping

When coordinating, always:
1. Break down complex tasks into subtasks
2. Route each subtask to the most appropriate agent
3. Collect and synthesize results
4. Provide clear status updates
5. Handle errors gracefully with fallbacks`,
    model: google('gemini-2.5-flash-preview-09-2025'),
    memory: pgMemory,
})

// A2A Context for coordinating with other agents
export interface A2ACoordinatorContext {
    taskType: 'financial' | 'content' | 'rag' | 'report' | 'coordination'
    agents: string[] // List of agent IDs to coordinate
    workflow: 'sequential' | 'parallel' | 'conditional'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    deadline?: Date
    qualityRequirements?: string[]
    governanceLevel?: 'public' | 'internal' | 'confidential'
}

// Helper function to create A2A coordination tasks
export function createA2ATask(
    description: string,
    context: A2ACoordinatorContext,
    input: Record<string, unknown>
) {
    return {
        description,
        context,
        input,
        timestamp: new Date().toISOString(),
        coordinator: 'a2aCoordinator'
    }
}

// Example coordination workflows
export const coordinationWorkflows = {
    // Financial analysis workflow
    portfolioAnalysis: {
        agents: ['stockAnalysis', 'cryptoAnalysis', 'report'],
        workflow: 'parallel' as const,
        steps: [
            'Analyze individual assets',
            'Assess portfolio risk',
            'Generate comprehensive report'
        ]
    },

    // Content creation workflow
    contentPipeline: {
        agents: ['research', 'copywriter', 'editor', 'evaluation'],
        workflow: 'sequential' as const,
        steps: [
            'Research topic thoroughly',
            'Create initial content draft',
            'Edit and refine content',
            'Evaluate quality and completeness'
        ]
    },

    // RAG query workflow
    ragQuery: {
        agents: ['retrieve', 'rerank', 'answerer', 'verifier'],
        workflow: 'sequential' as const,
        steps: [
            'Retrieve relevant documents',
            'Rank and prioritize results',
            'Generate governed answer',
            'Verify accuracy and compliance'
        ]
    }
}
