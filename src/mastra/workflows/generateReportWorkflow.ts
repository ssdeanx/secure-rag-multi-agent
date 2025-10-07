import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { log } from '../config/logger'
import { reportAgent } from '../agents/reportAgent'

// Map research output to report input and handle conditional logic
const processResearchResultStep = createStep({
    id: 'process-research-result',
    inputSchema: z.object({
        approved: z.boolean().optional(),
        researchData: z.any(),
    }),
    outputSchema: z.object({
        report: z.string().optional(),
        completed: z.boolean(),
    }),
    execute: async ({ inputData }) => {
        // First determine if research was approved/successful
        const approved =
            (inputData.approved ?? true) &&
            inputData.researchData !== undefined &&
            inputData.researchData !== null

        if (!approved) {
            log.info('Research not approved or incomplete, ending workflow')
            return { completed: false }
        }

        // If approved, generate report using reportAgent
        try {
            log.info('Generating report from research data...')

            const reportPrompt = `Generate a comprehensive report based on this research data: ${JSON.stringify(inputData.researchData, null, 2)}

Please structure the report in Markdown format with:
1. Executive Summary
2. Key Learnings
3. Detailed Findings with sources
4. Appendix with research process details`

            const result = await reportAgent.generate(
                [
                    {
                        role: 'user',
                        content: reportPrompt,
                    },
                ],
                {
                    maxSteps: 10,
                    structuredOutput: {
                        schema: z.object({
                            report: z.string(),
                            summary: z.string().optional(),
                            keyInsights: z.array(z.string()).optional(),
                        }),
                    },
                }
            )

            log.info('Report generated successfully!')

            // Return the structured report content
            return {
                report:
                    result.object?.report ||
                    result.text ||
                    'Report generation failed',
                completed: true,
            }
        } catch (error) {
            log.error('Error generating report', { error })
            return { completed: false }
        }
    },
})

// Create the report generation workflow
export const generateReportWorkflow = createWorkflow({
    id: 'generate-report-workflow',
    inputSchema: z.object({
        approved: z.boolean().optional(),
        researchData: z.any(),
    }),
    outputSchema: z.object({
        report: z.string().optional(),
        completed: z.boolean(),
    }),
    steps: [processResearchResultStep],
})
