/**
 * Customer Lifecycle Network
 *
 * A multi-agent network that orchestrates specialized agents for customer journey management,
 * from initial sales engagement through customer success and renewal.
 *
 * Network Agents:
 * - Sales Intelligence Agent: Lead qualification, deal strategy, pricing guidance
 * - Operations Optimizer Agent: Onboarding workflows, support procedures, escalation paths
 * - Compliance Advisor Agent: Contract terms, regulatory requirements, data handling
 *
 * Key Features:
 * - Non-deterministic LLM-based routing across customer lifecycle stages
 * - Single task execution for stage-specific queries
 * - Complex task decomposition for multi-stage customer journey analysis
 * - Memory-backed customer context and historical interactions
 *
 * Use Cases:
 * - Qualify leads and determine ideal customer profile fit
 * - Guide deal negotiations and pricing discussions
 * - Orchestrate customer onboarding and training
 * - Monitor customer health scores and renewal risks
 * - Manage escalations and churn prevention
 * - Identify expansion opportunities
 */

import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { salesIntelligenceAgent } from '../sales-intelligence.agent'
import { operationsOptimizerAgent } from '../operations-optimizer.agent'
import { complianceAdvisorAgent } from '../compliance-advisor.agent'
import { pgMemory } from '../../config/pg-storage'
import { log } from '../../config/logger'
import { createAnswerRelevancyScorer, createToxicityScorer } from '@mastra/evals/scorers/llm'
import { googleAIFlashLite } from '../../config/google'
import { researchCompletenessScorer, sourceDiversityScorer, summaryQualityScorer, taskCompletionScorer } from '../custom-scorers'

log.info('Initializing Customer Lifecycle Network...')

export interface CustomerLifecycleNetworkContext {
    userId: string
    tier: 'pro' | 'enterprise' | 'free'
    allowTags: string[]
    maxClassification: 'internal' | 'confidential' | 'public'
    lifecycleStage?: 'prospecting' | 'sales' | 'onboarding' | 'adoption' | 'renewal' | 'advocacy'
    customerId?: string
    customerHealthScore?: number
}

/**
 * Customer Lifecycle Network
 *
 * A multi-agent network for managing the complete customer journey from lead to advocate.
 * Uses LLM-based routing to coordinate sales, operations, and compliance agents across
 * all customer touchpoints.
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between agents
 * - Tier-based access control (Pro and Enterprise)
 * - Customer lifecycle stage awareness (prospect → customer → advocate)
 * - Memory-backed customer context and interaction history
 *
 * Customer Lifecycle Stages:
 * 1. Prospecting: Lead qualification, ICP fit, initial outreach
 * 2. Sales: Discovery, demo, proposal, negotiation, close
 * 3. Onboarding: Kickoff, setup, training, go-live
 * 4. Adoption: Usage monitoring, feature adoption, optimization
 * 5. Renewal: Health assessment, renewal planning, expansion
 * 6. Advocacy: Case studies, references, community engagement
 */
export const customerLifecycleNetwork = new Agent({
    id: 'customer-lifecycle-network',
    name: 'Customer Lifecycle Network',
    description:
        'Multi-agent network for managing complete customer journey from lead to advocate',
    instructions: `
    A multi-agent customer lifecycle management network.

    Access Requirements:
    - Pro tier: Sales Intelligence, Operations Optimizer agents + internal documents
    - Enterprise tier: All agents including Compliance Advisor + confidential documents

    Capabilities:
    - Lead qualification and ideal customer profile (ICP) assessment
    - Sales deal strategy and pricing guidance
    - Contract review and negotiation support
    - Customer onboarding and training orchestration
    - Health score monitoring and churn prevention
    - Renewal forecasting and expansion opportunity identification
    - Escalation management and issue resolution

    Customer Lifecycle Stages:
    1. Prospecting (Sales Intelligence Agent)
        - Qualify leads using BANT and MEDDIC frameworks
        - Assess ICP fit (company size, industry, use case)
        - Determine initial outreach strategy
        - Use when: Lead qualification, prospecting, ICP questions

    2. Sales (Sales Intelligence Agent + Compliance Advisor)
        - Guide discovery calls and demo strategy
        - Provide pricing and packaging recommendations
        - Handle objections and competitive positioning
        - Review contract terms and red lines
        - Use when: Deal questions, pricing, proposals, negotiations

    3. Onboarding (Operations Optimizer Agent)
        - Execute onboarding playbook (5 phases: kickoff → optimization)
        - Coordinate technical setup and integration
        - Deliver training and documentation
        - Monitor go-live readiness
        - Use when: New customer onboarding, implementation, training

    4. Adoption (Operations Optimizer Agent)
        - Track usage metrics and feature adoption
        - Identify optimization opportunities
        - Provide best practice guidance
        - Monitor technical performance
        - Use when: Product usage, adoption, optimization questions

    5. Renewal (Sales Intelligence Agent)
        - Calculate customer health scores
        - Forecast renewal probability (T-120 to T-0 timeline)
        - Identify expansion signals (new users, features, use cases)
        - Plan Quarterly Business Reviews (QBRs)
        - Use when: Renewals, expansions, health score, QBR preparation

    6. Advocacy (Sales Intelligence Agent)
        - Identify promoter customers (NPS 9-10)
        - Coordinate case studies and testimonials
        - Facilitate customer advisory board participation
        - Manage reference programs
        - Use when: Case studies, references, community, advocacy

    Specialized Agents:
    1. Sales Intelligence Agent - Sales and customer success expert
        - Prospecting and qualification methodologies
        - Sales playbook and deal strategies
        - Commission structures and quota analysis
        - Customer success metrics and health scores
        - Renewal and expansion playbooks
        - Use when: Sales, prospecting, deals, customer success, renewals
        - Access: Pro and Enterprise tiers, internal classification

    2. Operations Optimizer Agent - Onboarding and operations expert
        - Customer onboarding SOPs (5-phase playbook)
        - Technical setup and integration procedures
        - Training and documentation guidelines
        - Escalation and incident management
        - Performance monitoring and optimization
        - Use when: Onboarding, training, technical issues, operations
        - Access: Pro and Enterprise tiers, internal classification

    3. Compliance Advisor Agent - Contract and compliance expert
        - Contract templates and negotiation guidelines
        - Regulatory compliance requirements (GDPR, CCPA)
        - Data security and privacy policies
        - SLA terms and service commitments
        - Use when: Contracts, compliance, legal, security, privacy
        - Access: Enterprise tier ONLY, confidential classification

    Routing Guidelines:
    - If lifecycle stage is prospecting/qualification → Sales Intelligence Agent
    - If lifecycle stage is sales/negotiation → Sales Intelligence + Compliance Advisor
    - If lifecycle stage is onboarding/training → Operations Optimizer Agent
    - If lifecycle stage is adoption/usage → Operations Optimizer Agent
    - If lifecycle stage is renewal/expansion → Sales Intelligence Agent
    - If lifecycle stage is advocacy/references → Sales Intelligence Agent
    - If query spans multiple stages → Coordinate multiple agents
    - If legal/compliance question → Compliance Advisor (Enterprise only)

    Context Management:
    - Maintain customer context across lifecycle stages
    - Track previous interactions and decisions
    - Preserve customer-specific customizations and requirements
    - Remember health score trends and renewal history

    Response Guidelines:
    - Always consider current lifecycle stage in recommendations
    - Cite relevant playbook sections with [docId]
    - Provide stage-appropriate next steps
    - Include timeline expectations (T-30, T-60, T-120 for renewals)
    - For high-risk situations (churn, escalation), flag urgency
    - Suggest cross-selling/upselling only when health score high

    Security Rules:
    - NEVER modify maxClassification from what user's tier allows
    - NEVER expose confidential commission/pricing to Pro tier
    - NEVER synthesize customer data not in authorized corpus
    - ALWAYS verify tier access before routing to Compliance Advisor
    - ALWAYS include citations for playbook recommendations
    `,
    model: google('gemini-2.5-flash-preview-09-2025'),
    memory: pgMemory,
    agents: {
        salesIntelligence: salesIntelligenceAgent,
        operationsOptimizer: operationsOptimizerAgent,
        complianceAdvisor: complianceAdvisorAgent,
    },
    workflows: {},
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
            sampling: { type: 'ratio', rate: 0.4 },
        },
        sourceDiversity: {
            scorer: sourceDiversityScorer,
            sampling: { type: 'ratio', rate: 0.4 },
        },
        summaryQuality: {
            scorer: summaryQualityScorer,
            sampling: { type: 'ratio', rate: 0.4 },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.5 },
        },
    },
})

