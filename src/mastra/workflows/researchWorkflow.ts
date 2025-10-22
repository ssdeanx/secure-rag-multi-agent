// ---------------------------------------------
// Multi-Agent Research Orchestrator for Cedar OS Integration
// Advanced orchestrator using parallel execution, dynamic branching, and agent-to-agent communication
// Uses coordinator pattern with quality gates and human-in-the-loop capabilities
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { researchAgent } from '../agents/researchAgent'
import { copywriterAgent } from '../agents/copywriterAgent'
import { editorAgent } from '../agents/editorAgent'
import { evaluationAgent } from '../agents/evaluationAgent'
import { learningExtractionAgent } from '../agents/learningExtractionAgent'
import {
    logStepStart,
    logStepEnd,
    logError,
} from '../config/logger'
import {
    ResearchWorkflowInputSchema,
    ResearchQueryAnalysisSchema,
    ResearchSourceCollectionSchema,
    ResearchLearningSchema,
    ResearchWorkflowOutputSchema,
} from './researchWorkflowTypes'

// =============================================
// COORDINATOR AGENT - Analyzes query and orchestrates multi-agent execution
// =============================================

const coordinatorAnalysisStep = createStep({
    id: 'research-coordinator-analysis',
    description: 'Coordinator agent analyzes research query and determines multi-agent orchestration strategy',
    inputSchema: ResearchWorkflowInputSchema,
    outputSchema: z.object({
        orchestrationStrategy: z.object({
            complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
            requiredAgents: z.array(z.string()),
            parallelExecution: z.boolean(),
            qualityThreshold: z.number().min(0).max(1),
            humanInterventionRequired: z.boolean(),
            estimatedDuration: z.string(),
            communicationProtocol: z.string(),
        }),
        queryAnalysis: ResearchQueryAnalysisSchema,
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('research-coordinator-analysis', {
            queryLength: inputData.query.length,
            researchDepth: inputData.researchDepth,
        })

        try {
            // Coordinator agent analyzes the query and determines orchestration strategy
            const coordinatorPrompt = `You are the Research Coordinator Agent. Analyze this research request and determine the optimal multi-agent orchestration strategy.

RESEARCH QUERY: "${inputData.query}"
RESEARCH DEPTH: ${inputData.researchDepth}
SOURCE TYPES: ${inputData.sourceTypes.join(', ')}
CEDAR CONTEXT: ${inputData.cedarContext ? 'Available' : 'None'}

AVAILABLE AGENTS:
- researchAgent: Multi-source data collection (academic, web, news, financial)
- copywriterAgent: Content synthesis and drafting
- editorAgent: Quality improvement and refinement
- evaluationAgent: Result assessment and scoring
- learningExtractionAgent: Insight extraction and categorization

TASK: Determine the orchestration strategy including:
1. Complexity level (simple/moderate/complex/expert)
2. Which agents to deploy and in what configuration
3. Whether to use parallel execution
4. Quality threshold for acceptance
5. If human intervention is needed
6. Communication protocol for agent coordination

Return a detailed orchestration plan.`

            const coordinationResult = await researchAgent.generate(
                JSON.stringify({
                    task: 'coordinate_multi_agent_research',
                    prompt: coordinatorPrompt,
                    query: inputData.query,
                    depth: inputData.researchDepth,
                    sourceTypes: inputData.sourceTypes,
                    existingContext: inputData.cedarContext,
                })
            )

            // Parse coordination strategy from agent response
            const toolResult = coordinationResult.toolResults?.[0]?.payload?.result as {
                complexity?: string;
                requiredAgents?: string[];
                parallelExecution?: boolean;
                qualityThreshold?: number;
                humanInterventionRequired?: boolean;
                estimatedDuration?: string;
                communicationProtocol?: string;
                subTopics?: string[];
                researchStrategy?: string;
            } | undefined

            const orchestrationStrategy = {
                complexity: (toolResult?.complexity ?? 'moderate') as 'simple' | 'moderate' | 'complex' | 'expert',
                requiredAgents: toolResult?.requiredAgents ?? ['researchAgent', 'copywriterAgent', 'evaluationAgent'],
                parallelExecution: toolResult?.parallelExecution ?? true,
                qualityThreshold: toolResult?.qualityThreshold ?? 0.7,
                humanInterventionRequired: toolResult?.humanInterventionRequired ?? false,
                estimatedDuration: toolResult?.estimatedDuration ?? '15-30 minutes',
                communicationProtocol: toolResult?.communicationProtocol ?? 'shared_findings_protocol',
            }

            // Generate query analysis
            const analysis = ResearchQueryAnalysisSchema.parse({
                topic: inputData.query,
                subTopics: toolResult?.subTopics ?? [],
                researchStrategy: toolResult?.researchStrategy ?? 'multi_agent_orchestration',
                estimatedComplexity: orchestrationStrategy.complexity,
                requiredSources: inputData.sourceTypes,
            })

            logStepEnd('research-coordinator-analysis', {
                complexity: orchestrationStrategy.complexity,
                agentCount: orchestrationStrategy.requiredAgents.length,
                parallelExecution: orchestrationStrategy.parallelExecution,
                qualityThreshold: orchestrationStrategy.qualityThreshold,
            }, Date.now() - startTime)

            return {
                orchestrationStrategy,
                queryAnalysis: analysis,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('research-coordinator-analysis', error, { query: inputData.query })
            throw error
        }
    },
})

// =============================================
// PARALLEL AGENT EXECUTION - Multiple agents working simultaneously
// =============================================

const parallelResearchStep = createStep({
    id: 'research-parallel-execution',
    description: 'Execute multiple research agents in parallel for comprehensive analysis',
    inputSchema: z.object({
        orchestrationStrategy: z.object({
            complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
            requiredAgents: z.array(z.string()),
            parallelExecution: z.boolean(),
            qualityThreshold: z.number(),
            humanInterventionRequired: z.boolean(),
            estimatedDuration: z.string(),
            communicationProtocol: z.string(),
        }),
        queryAnalysis: ResearchQueryAnalysisSchema,
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        agentResults: z.record(z.string(), z.unknown()),
        sourceCollection: ResearchSourceCollectionSchema,
        draftSynthesis: z.string(),
        qualityAssessment: z.object({
            overallScore: z.number(),
            strengths: z.array(z.string()),
            weaknesses: z.array(z.string()),
            recommendations: z.array(z.string()),
        }),
        learnings: ResearchLearningSchema,
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData, writer }) => {
        const startTime = Date.now()
        logStepStart('research-parallel-execution', {
            agentCount: inputData.orchestrationStrategy.requiredAgents.length,
            complexity: inputData.orchestrationStrategy.complexity,
        })

        try {
            const agentResults: Record<string, unknown> = {}
            const promises: Array<Promise<void>> = []

            // Emit progress update
            await writer?.write({
                type: 'custom' as const,
                data: {
                    event: 'orchestration_started',
                    agentCount: inputData.orchestrationStrategy.requiredAgents.length,
                    complexity: inputData.orchestrationStrategy.complexity,
                },
            })

            // Execute agents in parallel based on orchestration strategy
            for (const agentName of inputData.orchestrationStrategy.requiredAgents) {
                const promise = (async () => {
                    try {
                        let result: unknown = null

                        switch (agentName) {
                            case 'researchAgent':
                                await writer?.write({
                                    type: 'custom' as const,
                                    data: { event: 'agent_started', agent: 'researchAgent', task: 'data_collection' },
                                })

                                result = await researchAgent.generate(
                                    JSON.stringify({
                                        task: 'parallel_research_collection',
                                        queryAnalysis: inputData.queryAnalysis,
                                        communicationProtocol: inputData.orchestrationStrategy.communicationProtocol,
                                        existingContext: inputData.cedarContext,
                                        agentOrchestration: true,
                                    })
                                )
                                break

                            case 'copywriterAgent':
                                await writer?.write({
                                    type: 'custom' as const,
                                    data: { event: 'agent_started', agent: 'copywriterAgent', task: 'content_synthesis' },
                                })

                                result = await copywriterAgent.generate(
                                    JSON.stringify({
                                        task: 'parallel_content_synthesis',
                                        topic: inputData.queryAnalysis.topic,
                                        communicationProtocol: inputData.orchestrationStrategy.communicationProtocol,
                                        existingContext: inputData.cedarContext,
                                        agentOrchestration: true,
                                    })
                                )
                                break

                            case 'editorAgent':
                                await writer?.write({
                                    type: 'custom' as const,
                                    data: { event: 'agent_started', agent: 'editorAgent', task: 'quality_improvement' },
                                })

                                result = await editorAgent.generate(
                                    JSON.stringify({
                                        task: 'parallel_quality_improvement',
                                        topic: inputData.queryAnalysis.topic,
                                        communicationProtocol: inputData.orchestrationStrategy.communicationProtocol,
                                        existingContext: inputData.cedarContext,
                                        agentOrchestration: true,
                                    })
                                )
                                break

                            case 'evaluationAgent':
                                await writer?.write({
                                    type: 'custom' as const,
                                    data: { event: 'agent_started', agent: 'evaluationAgent', task: 'quality_assessment' },
                                })

                                result = await evaluationAgent.generate(
                                    JSON.stringify({
                                        task: 'parallel_quality_assessment',
                                        topic: inputData.queryAnalysis.topic,
                                        communicationProtocol: inputData.orchestrationStrategy.communicationProtocol,
                                        qualityThreshold: inputData.orchestrationStrategy.qualityThreshold,
                                        existingContext: inputData.cedarContext,
                                        agentOrchestration: true,
                                    })
                                )
                                break

                            case 'learningExtractionAgent':
                                await writer?.write({
                                    type: 'custom' as const,
                                    data: { event: 'agent_started', agent: 'learningExtractionAgent', task: 'insight_extraction' },
                                })

                                result = await learningExtractionAgent.generate(
                                    JSON.stringify({
                                        task: 'parallel_learning_extraction',
                                        topic: inputData.queryAnalysis.topic,
                                        communicationProtocol: inputData.orchestrationStrategy.communicationProtocol,
                                        existingContext: inputData.cedarContext,
                                        agentOrchestration: true,
                                    })
                                )
                                break
                        }

                        agentResults[agentName] = result

                        await writer?.write({
                            type: 'custom' as const,
                            data: { event: 'agent_completed', agent: agentName, success: true },
                        })

                    } catch (error) {
                        agentResults[agentName] = { error: error instanceof Error ? error.message : 'Unknown error' }
                        await writer?.write({
                            type: 'custom' as const,
                            data: { event: 'agent_completed', agent: agentName, success: false, error: error instanceof Error ? error.message : 'Unknown error' },
                        })
                    }
                })()

                promises.push(promise)
            }

            // Wait for all agents to complete
            await Promise.all(promises)

            // Process and synthesize results from all agents
            const synthesisResult = await copywriterAgent.generate(
                JSON.stringify({
                    task: 'synthesize_parallel_results',
                    agentResults,
                    queryAnalysis: inputData.queryAnalysis,
                    orchestrationStrategy: inputData.orchestrationStrategy,
                    existingContext: inputData.cedarContext,
                })
            )

            // Extract synthesized outputs
            const toolResult = synthesisResult.toolResults?.[0]?.payload?.result as {
                sourceCollection?: unknown;
                draftSynthesis?: string;
                qualityAssessment?: {
                    overallScore?: number;
                    strengths?: string[];
                    weaknesses?: string[];
                    recommendations?: string[];
                };
                learnings?: unknown;
                confidence?: number;
                recommendations?: string[];
            } | undefined

            const sourceCollection = ResearchSourceCollectionSchema.parse(
                toolResult?.sourceCollection ?? {
                    academicPapers: [],
                    webSources: [],
                    newsArticles: [],
                    financialData: [],
                }
            )

            const draftSynthesis = synthesisResult.text ??
                toolResult?.draftSynthesis ??
                'Parallel synthesis completed'

            const qualityAssessment = {
                overallScore: toolResult?.qualityAssessment?.overallScore ?? 0.75,
                strengths: toolResult?.qualityAssessment?.strengths ?? [],
                weaknesses: toolResult?.qualityAssessment?.weaknesses ?? [],
                recommendations: toolResult?.qualityAssessment?.recommendations ?? [],
            }

            const learnings = ResearchLearningSchema.parse(
                toolResult?.learnings ?? {
                    learnings: [],
                    insights: [],
                }
            )

            logStepEnd('research-parallel-execution', {
                agentsCompleted: Object.keys(agentResults).length,
                sourceCount: sourceCollection.academicPapers.length +
                           sourceCollection.webSources.length +
                           sourceCollection.newsArticles.length +
                           sourceCollection.financialData.length,
                qualityScore: qualityAssessment.overallScore,
            }, Date.now() - startTime)

            return {
                agentResults,
                sourceCollection,
                draftSynthesis,
                qualityAssessment,
                learnings,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('research-parallel-execution', error, {
                agentCount: inputData.orchestrationStrategy.requiredAgents.length,
            })
            throw error
        }
    },
})

// =============================================
// QUALITY GATE AND BRANCHING - Dynamic routing based on research quality
// =============================================

const qualityGateStep = createStep({
    id: 'research-quality-gate',
    description: 'Evaluate research quality and determine next steps (complete, improve, or suspend)',
    inputSchema: z.object({
        agentResults: z.record(z.string(), z.unknown()),
        orchestrationStrategy: z.object({
            qualityThreshold: z.number(),
            humanInterventionRequired: z.boolean(),
        }),
        qualityAssessment: z.object({
            overallScore: z.number(),
            strengths: z.array(z.string()),
            weaknesses: z.array(z.string()),
            recommendations: z.array(z.string()),
        }),
        sourceCollection: ResearchSourceCollectionSchema,
        draftSynthesis: z.string(),
        learnings: ResearchLearningSchema,
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        qualityGateResult: z.object({
            passed: z.boolean(),
            score: z.number(),
            action: z.enum(['complete', 'improve', 'suspend']),
            reasoning: z.string(),
            improvementPlan: z.array(z.string()).optional(),
        }),
        cedarContext: z.unknown().optional(),
    }),
    suspendSchema: z.object({
        reason: z.string(),
        currentQuality: z.number(),
        requiredQuality: z.number(),
        improvementSuggestions: z.array(z.string()),
    }),
    resumeSchema: z.object({
        humanApproval: z.boolean(),
        additionalInstructions: z.string().optional(),
        qualityOverride: z.boolean().optional(),
    }),
    execute: async ({ inputData, suspend }) => {
        const startTime = Date.now()
        logStepStart('research-quality-gate', {
            currentScore: inputData.qualityAssessment.overallScore,
            threshold: inputData.orchestrationStrategy.qualityThreshold,
        })

        try {
            const score = inputData.qualityAssessment.overallScore
            const threshold = inputData.orchestrationStrategy.qualityThreshold
            const passed = score >= threshold

            let action: 'complete' | 'improve' | 'suspend' = 'complete'
            let reasoning = ''
            let improvementPlan: string[] | undefined

            if (passed) {
                action = 'complete'
                reasoning = `Quality score ${score.toFixed(2)} meets threshold ${threshold}. Research is ready for final synthesis.`
            } else if (inputData.orchestrationStrategy.humanInterventionRequired || score < 0.5) {
                action = 'suspend'
                reasoning = `Quality score ${score.toFixed(2)} below threshold ${threshold}. Human intervention required.`
                improvementPlan = inputData.qualityAssessment.recommendations
            } else {
                action = 'improve'
                reasoning = `Quality score ${score.toFixed(2)} below threshold ${threshold}. Will attempt automated improvement.`
                improvementPlan = inputData.qualityAssessment.recommendations.slice(0, 3)
            }

            const qualityGateResult = {
                passed,
                score,
                action,
                reasoning,
                improvementPlan,
            }

            // If human intervention is required, suspend the workflow
            if (action === 'suspend') {
                logStepEnd('research-quality-gate', {
                    action: 'suspended',
                    score,
                    threshold,
                }, Date.now() - startTime)

                return await suspend({
                    reason: reasoning,
                    currentQuality: score,
                    requiredQuality: threshold,
                    improvementSuggestions: improvementPlan ?? [],
                })
            }

            logStepEnd('research-quality-gate', {
                action,
                score,
                passed,
            }, Date.now() - startTime)

            return {
                qualityGateResult,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('research-quality-gate', error, {
                currentScore: inputData.qualityAssessment.overallScore,
            })
            throw error
        }
    },
})

// =============================================
// IMPROVEMENT STEP - Automated quality improvement when quality gate fails
// =============================================

const improvementStep = createStep({
    id: 'research-improvement',
    description: 'Automatically improve research quality using additional agent iterations',
    inputSchema: z.object({
        qualityGateResult: z.object({
            passed: z.boolean(),
            score: z.number(),
            action: z.enum(['complete', 'improve', 'suspend']),
            reasoning: z.string(),
            improvementPlan: z.array(z.string()).optional(),
        }),
        orchestrationStrategy: z.object({
            requiredAgents: z.array(z.string()),
        }),
        sourceCollection: ResearchSourceCollectionSchema,
        draftSynthesis: z.string(),
        learnings: ResearchLearningSchema,
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        improvedSynthesis: z.string(),
        improvedQualityAssessment: z.object({
            overallScore: z.number(),
            strengths: z.array(z.string()),
            weaknesses: z.array(z.string()),
            recommendations: z.array(z.string()),
        }),
        improvementResults: z.array(z.string()),
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData, writer }) => {
        const startTime = Date.now()
        logStepStart('research-improvement', {
            originalScore: inputData.qualityGateResult.score,
            improvementPlan: inputData.qualityGateResult.improvementPlan?.length ?? 0,
        })

        try {
            await writer?.write({
                type: 'custom' as const,
                data: { event: 'improvement_started', improvementPlan: inputData.qualityGateResult.improvementPlan },
            })

            // Use editor and evaluation agents to improve quality
            const improvementPromises = [
                // Editor agent for content improvement
                editorAgent.generate(
                    JSON.stringify({
                        task: 'improve_research_quality',
                        originalContent: inputData.draftSynthesis,
                        improvementPlan: inputData.qualityGateResult.improvementPlan,
                        sources: inputData.sourceCollection,
                        learnings: inputData.learnings,
                        existingContext: inputData.cedarContext,
                    })
                ),
                // Evaluation agent for quality reassessment
                evaluationAgent.generate(
                    JSON.stringify({
                        task: 'reassess_improved_quality',
                        originalAssessment: inputData.qualityGateResult,
                        improvementPlan: inputData.qualityGateResult.improvementPlan,
                        existingContext: inputData.cedarContext,
                    })
                ),
            ]

            const [editorResult, evaluationResult] = await Promise.all(improvementPromises)

            // Extract improved content
            const editorToolResult = editorResult.toolResults?.[0]?.payload?.result as {
                improvedContent?: string;
                changes?: string[];
                confidence?: number;
            } | undefined
            const improvedSynthesis =
                editorResult.text ?? editorToolResult?.improvedContent ??
                inputData.draftSynthesis

            // Extract improved quality assessment
            const evalToolResult = evaluationResult.toolResults?.[0]?.payload?.result as {
                overallScore?: number;
                strengths?: string[];
                weaknesses?: string[];
                recommendations?: string[];
            } | undefined
            const improvedQualityAssessment = {
                overallScore: evalToolResult?.overallScore ?? inputData.qualityGateResult.score + 0.1,
                strengths: evalToolResult?.strengths ?? [],
                weaknesses: evalToolResult?.weaknesses ?? [],
                recommendations: evalToolResult?.recommendations ?? [],
            }

            const improvementResults = inputData.qualityGateResult.improvementPlan ?? []

            await writer?.write({
                type: 'custom' as const,
                data: {
                    event: 'improvement_completed',
                    originalScore: inputData.qualityGateResult.score,
                    improvedScore: improvedQualityAssessment.overallScore,
                    improvements: improvementResults.length,
                },
            })

            logStepEnd('research-improvement', {
                originalScore: inputData.qualityGateResult.score,
                improvedScore: improvedQualityAssessment.overallScore,
                improvementsApplied: improvementResults.length,
            }, Date.now() - startTime)

            return {
                improvedSynthesis,
                improvedQualityAssessment,
                improvementResults,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('research-improvement', error, {
                originalScore: inputData.qualityGateResult.score,
            })
            throw error
        }
    },
})

// =============================================
// FINAL SYNTHESIS - Generate comprehensive research output
// =============================================

const finalSynthesisStep = createStep({
    id: 'research-final-synthesis',
    description: 'Generate final comprehensive research synthesis with confidence scoring',
    inputSchema: z.object({
        qualityGateResult: z.object({
            passed: z.boolean(),
            score: z.number(),
            action: z.enum(['complete', 'improve', 'suspend']),
            reasoning: z.string(),
            improvementPlan: z.array(z.string()).optional(),
        }),
        agentResults: z.record(z.string(), z.unknown()),
        orchestrationStrategy: z.object({
            requiredAgents: z.array(z.string()),
        }),
        sourceCollection: ResearchSourceCollectionSchema,
        draftSynthesis: z.string(),
        learnings: ResearchLearningSchema,
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: ResearchWorkflowOutputSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()

        // Extract data from quality gate result
        const { qualityGateResult, sourceCollection, learnings, orchestrationStrategy } = inputData

        logStepStart('research-final-synthesis', {
            qualityScore: qualityGateResult.score,
            action: qualityGateResult.action,
            sourceCount: sourceCollection.academicPapers.length +
                        sourceCollection.webSources.length +
                        sourceCollection.newsArticles.length +
                        sourceCollection.financialData.length,
        })

        try {
            // Calculate comprehensive confidence score
            const sourceCount = sourceCollection.academicPapers.length +
                              sourceCollection.webSources.length +
                              sourceCollection.newsArticles.length +
                              sourceCollection.financialData.length

            const agentDiversity = orchestrationStrategy.requiredAgents.length
            const qualityScore = qualityGateResult.score

            // Enhanced confidence calculation
            const baseConfidence = Math.min(sourceCount / 20, 1) // Max confidence at 20+ sources
            const agentBonus = Math.min(agentDiversity / 5, 0.3) // Up to 30% bonus for agent diversity
            const qualityBonus = qualityScore * 0.2 // Up to 20% for quality
            const confidence = Math.min(baseConfidence + agentBonus + qualityBonus, 1)

            // Generate final research summary
            const researchSummary = {
                topic: 'Multi-Agent Research Synthesis',
                keyFindings: learnings.insights.slice(0, 5).map(i => i.insight),
                confidence,
                sourcesAnalyzed: sourceCount,
                agentsUsed: agentDiversity,
                orchestrationStrategy: orchestrationStrategy.requiredAgents.join(', '),
            }

            // Format papers for output
            const papers = sourceCollection.academicPapers.slice(0, 15).map(paper => ({
                id: `paper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: paper.title,
                authors: paper.authors,
                relevance: paper.relevanceScore,
                url: paper.url,
            }))

            // Format sources for output
            const sources = [
                ...sourceCollection.webSources.map(source => ({
                    id: `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    title: source.title,
                    url: source.url,
                    sourceType: source.sourceType as 'web' | 'pdf' | 'article',
                    credibility: source.credibilityScore,
                })),
                ...sourceCollection.newsArticles.map(article => ({
                    id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    title: article.title,
                    url: article.url,
                    sourceType: 'article' as const,
                    credibility: article.relevanceScore,
                })),
            ].slice(0, 25)

            // Format learnings for output
            const learningsOutput = learnings.learnings.map(learning => ({
                content: learning.content,
                category: learning.category,
                importance: learning.importance,
                source: learning.source,
            }))

            const result = {
                researchSummary,
                papers,
                sources,
                learnings: learningsOutput,
                message: `Multi-agent research orchestration completed successfully. Used ${agentDiversity} agents across ${sourceCount} sources with ${qualityScore.toFixed(2)} quality score. Quality gate action: ${qualityGateResult.action}.`,
                success: true,
            }

            logStepEnd('research-final-synthesis', {
                confidence,
                papersCount: papers.length,
                sourcesCount: sources.length,
                learningsCount: learningsOutput.length,
                agentsUsed: agentDiversity,
                synthesisType: qualityGateResult.action === 'complete' ? 'direct' : 'quality-gated',
            }, Date.now() - startTime)

            return result
        } catch (error) {
            logError('research-final-synthesis', error, {
                synthesisType: qualityGateResult.action === 'complete' ? 'direct' : 'quality-gated',
            })

            // Return error result
            return {
                researchSummary: {
                    topic: 'Research Synthesis Failed',
                    keyFindings: ['Synthesis process encountered errors'],
                    confidence: 0,
                    sourcesAnalyzed: 0,
                    agentsUsed: 0,
                    orchestrationStrategy: 'error_recovery',
                },
                papers: [],
                sources: [],
                learnings: [],
                message: `Multi-agent research synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                success: false,
            }
        }
    },
})

// =============================================
// ADVANCED MULTI-AGENT RESEARCH ORCHESTRATOR WORKFLOW
// =============================================

export const researchWorkflow = createWorkflow({
    id: 'research-orchestrator-workflow',
    inputSchema: ResearchWorkflowInputSchema,
    outputSchema: ResearchWorkflowOutputSchema,
})
    // Phase 1: Coordinator Analysis
    .then(coordinatorAnalysisStep)

    // Phase 2: Parallel Multi-Agent Execution
    .then(parallelResearchStep)

    // Phase 3: Quality Assessment and Branching
    .then(qualityGateStep)

    // Phase 4: Conditional Processing based on quality gate result
    .branch([
        // If quality gate passed or action is 'complete', go directly to final synthesis
        [async ({ inputData }) => {
            const gateResult = inputData.qualityGateResult
            return gateResult?.passed || gateResult?.action === 'complete'
        }, finalSynthesisStep],

        // If improvement needed, go through improvement step then to final synthesis
        [async ({ inputData }) => {
            const gateResult = inputData.qualityGateResult
            return gateResult?.action === 'improve'
        }, improvementStep],

        // Default fallback to final synthesis
        [async () => true, finalSynthesisStep],
    ])

    // Final synthesis step for improvement path
    .then(finalSynthesisStep)

    .commit()


