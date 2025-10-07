import { createMastraClient } from '@/lib/mastra/mastra-client'
import { createSSEStream, streamJSONEvent } from '@/src/utils/streamUtils'
import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

// workflow resume has to be defined in the actual workflow file moron.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const parsed = ResumeRequestSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: parsed.error.issues },
                { status: 400 }
            )
        }

        const { jwt, runId, step, resumeData, stream } = parsed.data

        // Verify JWT
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET ?? 'dev-secret'
        )
        try {
            const { payload } = await jwtVerify(jwt, secret)

            interface JwtClaims {
                [claim: string]: unknown
                roles?: string[] | string
                tenant?: string
                sub?: string
            }

            const rawPayload = payload as unknown as JwtClaims
            const rawRoles = rawPayload.roles
            const roles: string[] = Array.isArray(rawRoles)
                ? rawRoles.map(String)
                : typeof rawRoles === 'string'
                  ? [rawRoles]
                  : []

            const tenantRaw = rawPayload.tenant
            const tenant = typeof tenantRaw === 'string' ? tenantRaw.trim() : ''

            if (roles.length === 0 || tenant === '') {
                return NextResponse.json(
                    { error: 'Invalid user claims' },
                    { status: 401 }
                )
            }

            console.log(
                `Resume request from user: ${rawPayload.sub ?? 'unknown'} for run ${runId}`
            )
        } catch (verifyError) {
            console.error('JWT verification failed:', verifyError)
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        // Create Mastra client with user's JWT token
        const client = createMastraClient(jwt)

        try {
            // Resume the workflow via Mastra client
            // The client will call the Mastra backend API to resume the workflow

            if (stream) {
                // Streaming response using SSE
                return createSSEStream(async (controller) => {
                    try {
                        // Get the workflow instance from the run ID
                        // Note: We need the workflow name to get the workflow instance
                        // For now, assume 'chat-workflow' - you may want to store this with the runId
                        const workflow = client.getWorkflow('chat-workflow')
                        const run = await workflow.createRunAsync({ runId })

                        // Resume the workflow run
                        const result = await run.resumeAsync({
                            step,
                            resumeData,
                        })

                        if (result.status === 'success') {
                            streamJSONEvent(controller, {
                                type: 'message',
                                content: JSON.stringify(result.result),
                            })
                        } else if (result.status === 'suspended') {
                            streamJSONEvent(controller, {
                                type: 'suspended',
                                suspended: result.suspended,
                                steps: result.steps,
                            })
                        } else {
                            streamJSONEvent(controller, {
                                type: 'error',
                                message:
                                    result.error || 'Failed to resume workflow',
                            })
                        }
                    } catch (error) {
                        console.error('Resume error:', error)
                        streamJSONEvent(controller, {
                            type: 'error',
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Resume failed',
                        })
                    }
                })
            } else {
                // Non-streaming response
                const workflow = client.getWorkflow('chat-workflow')
                const run = await workflow.createRunAsync({ runId })

                const result = await run.resumeAsync({
                    step,
                    resumeData,
                })

                if (result.status === 'success') {
                    return NextResponse.json({
                        success: true,
                        result: result.result,
                        steps: result.steps,
                    })
                } else if (result.status === 'suspended') {
                    return NextResponse.json({
                        status: 'suspended',
                        suspended: result.suspended,
                        steps: result.steps,
                    })
                } else {
                    return NextResponse.json(
                        {
                            error: result.error || 'Failed to resume workflow',
                        },
                        { status: 400 }
                    )
                }
            }
        } catch (error) {
            console.error('Resume error:', error)
            return NextResponse.json(
                {
                    error: 'Failed to resume workflow',
                    details:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
