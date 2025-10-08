export class ValidationService {
    // Add helper to avoid loose equality and satisfy linter
    private static isNullOrUndefined(
        value: unknown
    ): value is null | undefined {
        return value === null || value === undefined
    }

    static validateEnvironmentVariable(name: string, value?: string): string {
        // Explicitly handle null/undefined first
        if (this.isNullOrUndefined(value)) {
            throw new Error(`${name} environment variable not configured`)
        }
        // Then handle empty/whitespace-only values
        const trimmed = value.trim()
        if (trimmed.length === 0) {
            throw new Error(`${name} environment variable not configured`)
        }
        return trimmed
    }

    static validateAccessTags(allowTags?: string[]): string[] {
        if (!allowTags || allowTags.length === 0) {
            throw new Error(
                'No access tags provided - cannot query without authorization'
            )
        }
        return allowTags
    }

    static validateJWTToken(jwt?: string): string {
        if (this.isNullOrUndefined(jwt)) {
            throw new Error('JWT token is required')
        }
        const token = jwt.trim()
        if (token.length === 0) {
            throw new Error('JWT token is required')
        }
        return token
    }

    static validateQuestion(question?: string): string {
        if (this.isNullOrUndefined(question)) {
            throw new Error('Question is required')
        }
        const q = question.trim()
        if (q.length === 0) {
            throw new Error('Question is required')
        }
        return q
    }

    // Validate that a Mastra instance exists. Use a generic to preserve the passed-in type
    static validateMastraInstance<T>(mastra?: T): T {
        if (this.isNullOrUndefined(mastra)) {
            throw new Error('Mastra instance not available')
        }
        return mastra
    }

    // Validate that vector store is initialized. Use a generic to preserve the passed-in type
    static validateVectorStore<T>(store?: T): T {
        if (this.isNullOrUndefined(store)) {
            throw new Error('Vector store not initialized')
        }
        return store
    }

    static validateTokenExpiry(exp?: number, now?: number): void {
        const currentTime = now ?? Math.floor(Date.now() / 1000)
        // Explicitly handle null/undefined (no expiry claim = skip validation)
        if (this.isNullOrUndefined(exp)) {
            return
        }
        // Reject non-finite numeric values (NaN, Infinity)
        if (!Number.isFinite(exp)) {
            throw new Error('Invalid token expiry value')
        }
        // Now perform the expiry check
        if (exp < currentTime) {
            throw new Error('JWT token has expired')
        }
    }

    static validateTokenNotBefore(nbf?: number, now?: number): void {
        const currentTime = now ?? Math.floor(Date.now() / 1000)
        // Explicitly handle null/undefined (no nbf claim = skip validation)
        if (this.isNullOrUndefined(nbf)) {
            return
        }
        // Reject non-finite numeric values (NaN, Infinity)
        if (!Number.isFinite(nbf)) {
            throw new Error('Invalid token not-before (nbf) value')
        }
        // Now perform the not-before check
        if (nbf > currentTime) {
            throw new Error('JWT token not yet valid')
        }
    }
}
