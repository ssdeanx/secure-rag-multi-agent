export class ValidationService {
  static validateEnvironmentVariable(name: string, value?: string): string {
    if (!value) {
      throw new Error(`${name} environment variable not configured`);
    }
    return value;
  }

  static validateAccessTags(allowTags?: string[]): string[] {
    if (!allowTags || allowTags.length === 0) {
      throw new Error("No access tags provided - cannot query without authorization");
    }
    return allowTags;
  }

  static validateJWTToken(jwt?: string): string {
    if (!jwt || jwt.trim().length === 0) {
      throw new Error("JWT token is required");
    }
    return jwt;
  }

  static validateQuestion(question?: string): string {
    if (!question || question.trim().length === 0) {
      throw new Error("Question is required");
    }
    return question;
  }

  static validateMastraInstance(mastra?: unknown) {
    if (!mastra) {
      throw new Error("Mastra instance not available");
    }
    return mastra;
  }

  static validateVectorStore(store?: unknown) {
    if (!store) {
      throw new Error("Vector store not initialized");
    }
    return store;
  }

  static validateTokenExpiry(exp?: number, now?: number): void {
    const currentTime = now || Math.floor(Date.now() / 1000);
    if (exp && exp < currentTime) {
      throw new Error("JWT token has expired");
    }
  }

  static validateTokenNotBefore(nbf?: number, now?: number): void {
    const currentTime = now || Math.floor(Date.now() / 1000);
    if (nbf && nbf > currentTime) {
      throw new Error("JWT token not yet valid");
    }
  }
}