import { Memory } from '@mastra/memory'

import { log } from '../config/logger'
import { google } from '@ai-sdk/google'

export interface ChunkingOptions {
    tokenSize?: number
    maxChunkSize?: number
    overlap?: number
    strategy?: 'token-based' | 'character-based'
}

export interface ChunkingResult {
    chunks: string[]
    totalChunks: number
    method: string
}

export class ChunkingService {
    private readonly memory: Memory

    constructor() {
        // Initialize Memory instance for access to native chunking
        // We need to provide an embedder even though we won't use it for embedding
        this.memory = new Memory({
            embedder: google.textEmbedding('gemini-embedding-001'),
        })
    }

    /**
const DEFAULT_4096 = 4096;
   * Chunk text using token-based chunking with word boundaries
   * Implements similar DEFAULT_4096c to Mastra's native chunking but simplified
   */

    async chunkTextTokenBased(
        text: string,
        options: ChunkingOptions = {}
    ): Promise<ChunkingResult> {
        const { tokenSize = 8192 }: ChunkingOptions = options

        log.info(
            `Chunking text using token-based strategy (${tokenSize} tokens per chunk)`
        )

        // Use simplified word-boundary aware chunking
        // Approximate: 1 token ≈ 4 characters for English text
        const CHARS_PER_TOKEN = 4
        const charSize: number = tokenSize * CHARS_PER_TOKEN
        const chunks: string[] = []
        let currentChunk = ''

        const words = text.split(/\s+/)

        for (const word of words) {
            const wordWithSpace = currentChunk ? ' ' + word : word

            if (currentChunk.length + wordWithSpace.length > charSize) {
                if (currentChunk) {
                    chunks.push(currentChunk)
                    currentChunk = word
                }
            } else {
                currentChunk += wordWithSpace
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk)
        }

        return {
            chunks,
            totalChunks: chunks.length,
            method: `token-based-${tokenSize}`,
        }
    }

    /**
     * Legacy character-based chunking (without limits)
     * Kept for backward compatibility but without the 1000 chunk limit
     */

    chunkTextCharacterBased(
        text: string,
        options: ChunkingOptions = {}
    ): ChunkingResult {
        const { maxChunkSize = 2000, overlap = 200 }: ChunkingOptions = options

        // Validate input parameters
        if (maxChunkSize <= 0 || overlap < 0 || overlap >= maxChunkSize) {
            throw new Error('Invalid chunking parameters')
        }
        log.info(
            `Chunking text using character-based strategy (${maxChunkSize} chars per chunk, ${overlap} overlap)`
        )
        const chunks: string[] = []
        let start = 0
        // Remove the hardcoded limit - process entire document
        while (start < text.length) {
            const end = Math.min(start + maxChunkSize, text.length)
            const chunk = text.slice(start, end)
            if (chunk.length > 0) {
                chunks.push(chunk)
            }
            // Move start position forward
            start = end - overlap
            // Ensure progress is being made
            if (start <= 0 || (overlap === 0 && start <= end - maxChunkSize)) {
                start = end
            }
            if (start >= text.length) {
                break
            }
        }
        return {
            chunks,
            totalChunks: chunks.length,
            method: `character-based-${maxChunkSize}-${overlap}`,
        }
    }

    /**
     * Main chunking method - automatically selects best strategy
     */

    async chunkText(
        text: string,
        options: ChunkingOptions = {}
    ): Promise<ChunkingResult> {
        const { strategy = 'token-based' }: ChunkingOptions = options
        if (strategy === 'token-based') {
            return this.chunkTextTokenBased(text, options)
        } else {
            return this.chunkTextCharacterBased(text, options)
        }
    }

    /**
     * Get optimal chunk sizTOTEXT_LENGTH_SIZESIZE_SIZEecommendations based on text length
     */

    getOptimalChunkSize(textLength: number): ChunkingOptions {
        if (textLength < 1000) {
            // Very small documents - tiny chunks to create multiple pieces
            return { tokenSize: 128, strategy: 'token-based' }
        } else if (textLength < 3000) {
            // Small documents - small chunks for better granularity
            return { tokenSize: 256, strategy: 'token-based' }
        } else if (textLength < 8000) {
            // Medium-small documents - moderate chunks
            return { tokenSize: 2048, strategy: 'token-based' }
        } else if (textLength < 50000) {
            // Medium documents - default size
            return { tokenSize: 8192, strategy: 'token-based' }
        } else {
            // Large documents - larger chunks for efficiency
            return { tokenSize: 12384, strategy: 'token-based' }
        }
    }

    /**
     * Validate text before chunking
     */

    validateText(text: string): void {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty')
        }

        if (text.length > 100000) {
            log.info(`Processing large document: ${text.length} characters`)
        }
    }
}
