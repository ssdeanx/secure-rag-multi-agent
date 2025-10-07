import { createVertex } from '@ai-sdk/google-vertex'

const project = process.env.GOOGLE_CLOUD_PROJECT
const location = process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1'
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!project || project.trim() === '') {
    throw new Error('GOOGLE_CLOUD_PROJECT is required for Vertex configuration')
}

const vertex = createVertex({
    project,
    location,
    ...(keyFile !== null ? { googleAuthOptions: { keyFile } } : {}),
})

export const vertexAIPro = vertex('gemini-2.5-pro')
export const vertexAIFlash = vertex('gemini-2.5-flash-preview-09-2025')
export const vertexAIFlashLite = vertex('gemini-2.5-flash-lite-preview-09-2025')

export default vertex
