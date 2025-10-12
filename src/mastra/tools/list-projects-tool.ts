import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { ProjectRepository } from '../infra/repositories/project.js'
import { projectSetupStepInputSchema } from '../workflows/template-reviewer-workflow/index.js'

interface ToolConfig {
    repository: ProjectRepository
}

// Zod schema for list tool input parameters
const listProjectsInputSchema = z
    .object({
        id: z.string().optional().describe('Filter by project ID'),
        status: z
            .string()
            .optional()
            .describe(
                "Filter by project status (e.g., 'initialized', 'ready', 'evaluated')"
            ),
        name: z
            .string()
            .optional()
            .describe(
                'Filter by project name (case-insensitive partial match)'
            ),
        repoURL: z.string().optional().describe('Filter by repository URL'),
    })
    .optional()

export const listProjectsTool = ({ repository }: ToolConfig) =>
    createTool({
        description:
            'List existing template reviews/projects with optional filters',
        id: 'listExistingResults',
        inputSchema: listProjectsInputSchema,
        outputSchema: z.array(projectSetupStepInputSchema),
        execute: async ({ context }) => {
            const filters = context as
                | {
                      id?: string
                      status?: string
                      name?: string
                      repoURL?: string
                  }
                | undefined
            console.log('Listing projects with filters:', filters)
            return (await repository.list(filters)).map((r) => r.toDTO())
        },
    })
