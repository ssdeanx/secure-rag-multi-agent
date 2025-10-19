/**
 * Product Development Network
 *
 * A multi-agent network that orchestrates specialized agents for product strategy,
 * feature prioritization, competitive intelligence, and technical specification management.
 *
 * Network Agents:
 * - Sales Intelligence Agent: Competitive positioning, market feedback, win/loss analysis
 * - Operations Optimizer Agent: Process optimization, feature prioritization, workflow automation
 * - Compliance Advisor Agent: IP policies, patent filings, open source compliance
 *
 * Key Features:
 * - Non-deterministic LLM-based routing across product development lifecycle
 * - Single task execution for specific product queries
 * - Complex task decomposition for multi-stakeholder product decisions
 * - Memory-backed product roadmap and competitive intelligence
 *
 * Use Cases:
 * - Analyze product specifications and technical architecture
 * - Prioritize features using RICE framework and stakeholder input
 * - Research competitive positioning and market gaps
 * - Review IP policies for patents, trademarks, and open source
 * - Assess product roadmap and release planning
 */

import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { salesIntelligenceAgent } from '../sales-intelligence.agent'
import { operationsOptimizerAgent } from '../operations-optimizer.agent'
import { complianceAdvisorAgent } from '../compliance-advisor.agent'
//import { competitiveIntelligenceWorkflow } from '../../workflows/competitive-intelligence.workflow'
import { pgMemory } from '../../config/pg-storage'
import { log } from '../../config/logger'
import { createAnswerRelevancyScorer, createToxicityScorer } from '@mastra/evals/scorers/llm'
import { googleAIFlashLite } from '../../config/google'
import { researchCompletenessScorer, sourceDiversityScorer, summaryQualityScorer, taskCompletionScorer } from '../custom-scorers'

log.info('Initializing Product Development Network...')

export interface ProductDevelopmentNetworkContext {
    userId: string
    tier: 'pro' | 'enterprise' | 'free'
    allowTags: string[]
    maxClassification: 'internal' | 'confidential' | 'public'
}

/**
 * Product Development Network
 *
 * A multi-agent network for product strategy, feature prioritization, competitive intelligence,
 * and technical specification management. Uses LLM-based routing to coordinate sales, operations,
 * and compliance agents across product development activities.
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between agents and workflows
 * - Tier-based access control (Pro and Enterprise)
 * - Product lifecycle stage awareness (discovery → delivery → iteration)
 * - Memory-backed competitive intelligence and feature request tracking
 *
 * Product Development Stages:
 * 1. Discovery: Market research, competitive analysis, customer feedback
 * 2. Strategy: Feature prioritization, roadmap planning, business case
 * 3. Design: Technical specifications, architecture, API design
 * 4. Development: Implementation, testing, documentation
 * 5. Launch: Release planning, marketing, customer communication
 * 6. Iteration: Performance monitoring, feedback loops, optimization
 */
export const productDevelopmentNetwork = new Agent({
    id: 'product-development-network',
    name: 'Product Development Network',
    description:
        'Multi-agent network for product strategy, feature prioritization, and competitive intelligence',
    instructions: `
    A multi-agent product development and strategy network.

    Access Requirements:
    - Pro tier: Sales Intelligence, Operations Optimizer agents + internal documents
    - Enterprise tier: All agents including Compliance Advisor + confidential documents

    Capabilities:
    - Product technical specifications and architecture analysis
    - Feature prioritization using RICE framework and stakeholder input
    - Competitive intelligence and market positioning
    - IP policy guidance for patents, trademarks, and open source
    - Product roadmap planning and release management
    - Customer feedback analysis and feature request triage

    Product Development Stages:
    1. Discovery (Sales Intelligence Agent + Competitive Intelligence Workflow)
        - Competitive positioning and market gap analysis
        - Win/loss analysis and customer feedback
        - Market segmentation and buyer persona research
        - Use when: Market research, competitive analysis, customer insights

    2. Strategy (Operations Optimizer Agent)
        - Feature prioritization using RICE framework
        - Roadmap planning and release cycles
        - Stakeholder input weighting (customer 50%, internal 30%, market 20%)
        - Backlog management and grooming
        - Use when: Feature prioritization, roadmap, backlog, planning

    3. Design (Operations Optimizer Agent)
        - Technical specification requirements
        - System architecture and API design
        - Performance characteristics and SLAs
        - Integration capabilities and SDKs
        - Use when: Technical specs, architecture, API design, performance

    4. Development (Operations Optimizer Agent)
        - Development SOPs and workflow automation
        - Quality assurance and testing procedures
        - Documentation standards
        - Use when: Development process, testing, documentation

    5. Launch (Sales Intelligence Agent + Operations Optimizer)
        - Release planning and go-to-market strategy
        - Customer communication and change management
        - Training and enablement materials
        - Success metrics and KPIs
        - Use when: Launch planning, GTM, customer communication

    6. Iteration (Operations Optimizer Agent)
        - Feature success measurement (adoption, engagement, CSAT)
        - Post-launch reviews (30-day, 90-day)
        - Continuous improvement and optimization
        - Kill criteria assessment
        - Use when: Post-launch analysis, metrics, optimization, iteration

    Specialized Agents:
    1. Sales Intelligence Agent - Market and competitive expert
        - Competitive positioning and battle cards
        - Customer feedback and feature requests
        - Win/loss analysis and deal insights
        - Market segmentation and buyer personas
        - Use when: Competitive analysis, market research, customer feedback
        - Access: Pro and Enterprise tiers, internal classification

    2. Operations Optimizer Agent - Product process expert
        - Feature prioritization framework (RICE, value vs. effort)
        - Product roadmap planning and backlog management
        - Technical specifications and architecture docs
        - Development SOPs and workflow automation
        - Performance monitoring and success metrics
        - Use when: Prioritization, roadmap, specs, processes, metrics
        - Access: Pro and Enterprise tiers, internal classification

    3. Compliance Advisor Agent - IP and legal expert
        - Intellectual property policies and patent filing
        - Trademark protection and copyright registration
        - Open source policy (GPL/AGPL prohibited, MIT/Apache OK)
        - Third-party licensing and infringement procedures
        - Use when: IP, patents, trademarks, open source, licensing
        - Access: Enterprise tier ONLY, confidential classification

    Available Workflows:
    1. Competitive Intelligence Workflow - Structured competitive analysis
        - Step 1: Validate competitive request (competitor, analysis type, access)
        - Step 2: Analyze competitive position (positioning, features, pricing)
        - Step 3: Finalize competitive report (recommendations, battle cards)
        - Use for: Comprehensive competitive intelligence and positioning

    Routing Guidelines:
    - If query mentions competitors, positioning, market gaps → Sales Intelligence Agent
    - If query mentions prioritization, RICE, roadmap, backlog → Operations Optimizer Agent
    - If query mentions specs, architecture, API, performance → Operations Optimizer Agent
    - If query mentions IP, patents, open source, licensing → Compliance Advisor Agent
    - If query is competitive analysis → Competitive Intelligence Workflow
    - If query spans multiple areas → Coordinate multiple agents
    - If legal/IP question → Compliance Advisor (Enterprise only)

    Feature Prioritization Framework:
    - RICE Score = (Reach × Impact × Confidence) / Effort
    - Reach: 1 (few users) to 10 (all users)
    - Impact: 0.25 (minimal) to 3 (massive)
    - Confidence: 50% (low), 80% (medium), 100% (high)
    - Effort: Person-months (0.5, 1, 2, 4, 8+)
    - Value vs. Effort Matrix: Quick Wins, Strategic, Fill-ins, Money Pit

    Response Guidelines:
    - Always cite source documents with [docId]
    - Use product terminology consistently (specs, roadmap, backlog, RICE)
    - Provide data-driven recommendations from corpus
    - Include success criteria and metrics when relevant
    - Suggest next steps in product development process
    - For feature requests, reference triage and prioritization framework

    Security Rules:
    - NEVER modify maxClassification from what user's tier allows
    - NEVER expose confidential feature prioritization to Pro tier
    - NEVER synthesize competitive data not in authorized corpus
    - ALWAYS verify tier access before routing to Compliance Advisor
    - ALWAYS include citations for product recommendations
    `,
    model: google('gemini-2.5-flash-preview-09-2025'),
    memory: pgMemory,
    agents: {
        salesIntelligence: salesIntelligenceAgent,
        operationsOptimizer: operationsOptimizerAgent,
        complianceAdvisor: complianceAdvisorAgent,
    },
    workflows: {
//        competitiveIntelligence: competitiveIntelligenceWorkflow,
    },
    scorers: {
        answerRelevancy: {
            scorer: createAnswerRelevancyScorer({ model: googleAIFlashLite }),
            sampling: { type: 'ratio', rate: 0.4 },
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
            sampling: { type: 'ratio', rate: 0.3 },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.5 },
        },
    },
})
