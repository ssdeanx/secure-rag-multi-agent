/**
 * Business Intelligence Network
 *
 * A multi-agent network that orchestrates specialized business analysis agents
 * for sales intelligence, marketing insights, and product strategy analysis.
 *
 * Network Agents:
 * - Sales Intelligence Agent: Sales playbook, commission analysis, customer success metrics
 * - Compliance Advisor Agent: Legal contracts, regulatory compliance, IP policy guidance
 * - Operations Optimizer Agent: Process optimization, vendor management, incident response
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between specialized agents
 * - Single task execution for simple queries
 * - Complex task decomposition for multi-step business analysis
 * - Memory-backed decision making and tier-based access control
 *
 * Use Cases:
 * - Analyze sales performance and commission structures
 * - Get compliance guidance on contracts and regulations
 * - Optimize operational processes and vendor relationships
 * - Review marketing campaigns and brand guidelines
 * - Assess product specifications and feature prioritization
 */

import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { salesIntelligenceAgent } from '../sales-intelligence.agent'
import { complianceAdvisorAgent } from '../compliance-advisor.agent'
import { operationsOptimizerAgent } from '../operations-optimizer.agent'
//import { businessAnalysisWorkflow } from '../../workflows/business-analysis.workflow'
import { pgMemory } from '../../config/pg-storage'
import { log } from '../../config/logger'
import { createAnswerRelevancyScorer, createToxicityScorer } from '@mastra/evals/scorers/llm'
import { googleAIFlashLite } from '../../config/google'
import { researchCompletenessScorer, sourceDiversityScorer, summaryQualityScorer, taskCompletionScorer } from '../custom-scorers'

log.info('Initializing Business Intelligence Network...')

export interface BusinessIntelligenceNetworkContext {
    userId: string
    tier: 'pro' | 'enterprise'
    allowTags: string[]
    maxClassification: 'internal' | 'confidential'
}

/**
 * Business Intelligence Network
 *
 * A multi-agent network for comprehensive business analysis, compliance guidance, and operational optimization.
 * Uses LLM-based routing to automatically select appropriate agents and workflows for user queries.
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between agents and workflows
 * - Tier-based access control (Pro and Enterprise only)
 * - Single task execution with .generate() for simple queries
 * - Complex task execution for multi-step business analysis
 * - Memory-backed task history and decision making
 *
 * Use Cases:
 * - Analyze sales playbooks, commission structures, and customer success metrics
 * - Get guidance on legal contracts, compliance procedures, and IP policies
 * - Optimize operational processes, vendor management, and incident response
 * - Review marketing strategies, brand guidelines, and campaign budgets
 * - Assess product specifications, roadmaps, and feature prioritization
 */
export const businessIntelligenceNetwork = new Agent({
    id: 'business-intelligence-network',
    name: 'Business Intelligence Network',
    description:
        'Multi-agent network for business analysis, compliance guidance, and operational optimization',
    instructions: `
    A multi-agent business intelligence and optimization network.

    Access Requirements:
    - Pro tier: Sales Intelligence, Operations Optimizer agents + internal documents
    - Enterprise tier: All agents including Compliance Advisor + confidential documents

    Capabilities:
    - Sales performance analysis and commission structure insights
    - Legal compliance guidance and contract review
    - Operational process optimization and vendor management
    - Marketing strategy and brand guideline analysis
    - Product roadmap and feature prioritization insights

    Specialized Agents:
    1. Sales Intelligence Agent - Expert sales analyst
        - Sales playbook methodology and best practices
        - Commission structure and quota analysis
        - Customer success metrics and health scores
        - Competitive positioning and objection handling
        - Use when: User asks about sales, commissions, customer success, deals, pipeline
        - Access: Pro and Enterprise tiers, internal classification minimum

    2. Compliance Advisor Agent - Legal and compliance expert
        - Legal contract templates and negotiation guidelines
        - Regulatory compliance (GDPR, CCPA, SOC2) procedures
        - Intellectual property policies and patent processes
        - Security incident response and audit procedures
        - Use when: User asks about compliance, legal, contracts, IP, regulations, audits
        - Access: Enterprise tier ONLY, confidential classification required

    3. Operations Optimizer Agent - Process optimization expert
        - Operational SOPs and workflow automation
        - Vendor selection, onboarding, and performance monitoring
        - Incident management and business continuity
        - Capacity planning and performance optimization
        - Use when: User asks about operations, processes, vendors, incidents, efficiency
        - Access: Pro and Enterprise tiers, internal classification minimum

    Available Workflows:
    1. Business Analysis Workflow - Structured multi-step business intelligence
        - Step 1: Validate business request (domain, analysis type, access level)
        - Step 2: Analyze business data (gather documents, insights, recommendations)
        - Step 3: Finalize business report (compile comprehensive analysis)
        - Use for: Comprehensive, structured analysis of business operations

    Routing Guidelines:
    - If query mentions sales, commissions, quotas, CSM → Sales Intelligence Agent
    - If query mentions compliance, legal, contracts, IP, GDPR → Compliance Advisor Agent
    - If query mentions operations, vendors, SOPs, incidents → Operations Optimizer Agent
    - If query mentions marketing, brand, campaigns → Sales Intelligence Agent (marketing docs)
    - If query mentions products, roadmap, features → Operations Optimizer Agent (product docs)
    - If query is complex/multi-domain → Business Analysis Workflow
    - If user lacks tier access → Return access denied message with upgrade path

    Access Control Rules:
    - Always check user tier before routing to Compliance Advisor (Enterprise only)
    - Never route confidential document queries to Pro tier users
    - For cross-domain queries, use lowest classification agent that has all needed docs
    - Provide upgrade messaging for premium features (Enterprise features for Pro users)

    Response Guidelines:
    - Always cite source documents with [docId]
    - Include disclaimers for legal/compliance guidance ("Consult Legal for binding advice")
    - Provide actionable recommendations grounded in company policies
    - Suggest next steps or related business processes
    - Respect tier limits and classification boundaries
    - For denied access, explain why and suggest upgrade path

    Security Rules:
    - NEVER modify maxClassification from what user's tier allows
    - NEVER synthesize data not in authorized corpus documents
    - NEVER provide external business benchmarks unless in corpus
    - ALWAYS verify tier access before routing to Compliance Advisor
    - ALWAYS include citations for all factual claims
    `,
    model: google('gemini-2.5-flash-preview-09-2025'),
    memory: pgMemory,
    agents: {
        salesIntelligence: salesIntelligenceAgent,
        complianceAdvisor: complianceAdvisorAgent,
        operationsOptimizer: operationsOptimizerAgent,
    },
    workflows: {
//        businessAnalysis: businessAnalysisWorkflow,
    },
    scorers: {
        answerRelevancy: {
            scorer: createAnswerRelevancyScorer({ model: googleAIFlashLite }),
            sampling: { type: 'ratio', rate: 0.5 },
        },
        toxicity: {
            scorer: createToxicityScorer({ model: googleAIFlashLite }),
            sampling: { type: 'ratio', rate: 0.3 },
        },
        researchCompleteness: {
            scorer: researchCompletenessScorer,
            sampling: { type: 'ratio', rate: 0.6 },
        },
        sourceDiversity: {
            scorer: sourceDiversityScorer,
            sampling: { type: 'ratio', rate: 0.5 },
        },
        summaryQuality: {
            scorer: summaryQualityScorer,
            sampling: { type: 'ratio', rate: 0.4 },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.7 },
        },
    },
})

