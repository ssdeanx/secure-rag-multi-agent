

// filepath: app/api/roadmap/relationships/route.ts
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { roadmapRelationshipAnalysisWorkflow } from '@/src/mastra/workflows/roadmap-relationship-analysis.workflow';
import { z } from 'zod';

/**
 * Zod schema for roadmap item structure
 */
const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  nodeType: z.string().optional(),
  upvotes: z.number().optional(),
});

/**
 * Zod schema for the API request body
 */
const RequestSchema = z.object({
  roadmapItems: z.array(RoadmapItemSchema),
  jwt: z.string(), // JWT token in request body as per security patterns
});

/**
 * POST handler for roadmap relationships analysis
 * Uses Mastra workflow instead of direct agent calls, following repository patterns
 *
 * @param request - Next.js request object containing roadmap items and JWT
 * @returns JSON response with analyzed relationships and insights
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { roadmapItems, jwt } = RequestSchema.parse(body);

    // Log step start for observability
    console.log('Starting roadmap relationships API call', {
      itemCount: roadmapItems.length,
      hasJwt: !!jwt
    });

    // Validate JWT and get user context (following security patterns)
    // Note: JWT validation would be implemented here using AuthenticationService

    // Execute Mastra workflow for relationship analysis
    const result = await roadmapRelationshipAnalysisWorkflow.execute({
      inputData: { roadmapItems }
    });

    // Log successful completion
    console.log('Roadmap relationships API call completed', {
      relationshipCount: result.relationships.length,
      insightCount: result.insights.length
    });

    return NextResponse.json(result);

  } catch (error) {
    // Log error with context
    console.error('Roadmap relationships API error:', error);
    
    // Return structured error response
    return NextResponse.json(
      {
        error: 'Failed to analyze roadmap relationships',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
