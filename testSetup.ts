import { beforeAll, expect, vi } from 'vitest'
import { attachListeners } from '@mastra/evals'

// Mock env sensitive providers before importing mastra heavy modules
process.env.GOOGLE_GENERATIVE_AI_API_KEY =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'test-key'

// Attempt to mock gemini provider creation if present
vi.mock('./src/mastra/config/gemini-cli.ts', () => ({
    gemini: {},
}))

// Provide a lightweight mastra mock if real initialization is not required for component tests
vi.mock('./src/mastra/index', () => ({
    mastra: {
        on: () => {},
        emit: () => {},
    },
}))

// Now import (will resolve to mocked version)
import { mastra } from './src/mastra/index'
import '@testing-library/jest-dom'

// Roadmap API placeholder symbols to satisfy references in API route files during test type collection
// These are minimal no-op stand-ins so UI component tests don't fail on missing implementation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.roadmapRelationshipAnalysisWorkflow = {
    execute: async (_: any) => ({ relationships: [], insights: [] }),
} as unknown as typeof globalThis & {
    execute: (args: unknown) => Promise<unknown>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.RoadmapStreamInput = {
    safeParse: (val: any) => ({ success: true, data: { ...val } }),
} as unknown
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.RoadmapSyncInput = {
    safeParse: (val: any) => ({ success: true, data: { ...val } }),
} as unknown

beforeAll(async () => {
    // Store evals in Mastra Storage (requires storage to be enabled)
    await attachListeners(mastra)
})
