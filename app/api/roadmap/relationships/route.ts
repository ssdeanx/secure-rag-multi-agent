// filepath: app/api/roadmap/relationships/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jwtVerify } from 'jose';

interface JwtClaims {
	[key: string]: unknown;
	sub: string;
	roles: string[];
}

async function verifyJwt(token: string): Promise<JwtClaims | null> {
	try {
		const secretStr = process.env.JWT_SECRET ?? '';
		// In production a missing JWT_SECRET should make verification fail.
		if (!secretStr && process.env.NODE_ENV === 'production') {
			return null;
		}
		const secret = new TextEncoder().encode(secretStr || 'dev-secret');
		const { payload } = await jwtVerify(token, secret /* , { issuer: '...', audience: '...', algorithms: ['HS256'] } */);
		return payload as JwtClaims;
	} catch {
		return null;
	}
}

// Zod schema: single canonical definition
const RoadmapItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	status: z.string(),
});

const RequestSchema = z.object({
	roadmapItems: z.array(RoadmapItemSchema),
});

/**
 * POST handler for roadmap relationships analysis
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const { roadmapItems } = RequestSchema.parse(body);

		const authHeader = request.headers.get('authorization');
		if (authHeader?.startsWith('Bearer ') !== true) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const jwt = authHeader.slice('Bearer '.length);
		const claims = await verifyJwt(jwt);
		if (!claims) {
			return NextResponse.json({ error: 'Invalid JWT' }, { status: 401 });
		}

		console.log('Starting roadmap relationships API call', {
			itemCount: roadmapItems.length,
			userId: claims.sub,
		});

		// Execute workflow and treat result as unknown to avoid implicit any
		const result: unknown = await roadmapRelationshipAnalysisWorkflow.execute({
			inputData: { roadmapItems },
		});

		// Narrow result to an object and safely access possible arrays
		const resultObj = typeof result === 'object' && result !== null ? (result as Record<string, unknown>) : {};
		const relationships = Array.isArray(resultObj['relationships']) ? (resultObj['relationships'] as unknown[]) : [];
		const insights = Array.isArray(resultObj['insights']) ? (resultObj['insights'] as unknown[]) : [];

		console.log('Roadmap relationships API call completed', {
			relationshipCount: relationships.length,
			insightCount: insights.length,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Roadmap relationships API error:', error);
		return NextResponse.json(
			{
				error: 'Failed to analyze roadmap relationships',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
