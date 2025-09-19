# Testing Guidelines & Strategies

## Testing Philosophy

This governed RAG system requires comprehensive testing due to its security-critical nature. Testing should cover functionality, security, performance, and integration aspects.

## Testing Architecture

### Test Categories
1. **Unit Tests**: Individual components (services, agents, tools)
2. **Integration Tests**: Component interactions and workflows
3. **Security Tests**: Access control and data leakage prevention
4. **Performance Tests**: Scalability and resource usage
5. **End-to-End Tests**: Complete user scenarios

### Test Environment Setup
```bash
# Test environment setup
cp .env.example .env.test
# Configure test-specific environment variables
export NODE_ENV=test
export JWT_SECRET=test-secret-key
export QDRANT_URL=http://localhost:6333
export OPENAI_API_KEY=test-key-or-mock
```

## Unit Testing Patterns

### Service Testing
```typescript
// RoleService.test.ts
describe('RoleService', () => {
  describe('expandRoles', () => {
    test('should expand roles with hierarchy', () => {
      const userRoles = ['finance.viewer'];
      const expanded = RoleService.expandRoles(userRoles);
      
      expect(expanded).toContain('finance.viewer');
      expect(expanded).toContain('employee');
      expect(expanded).toContain('public');
      expect(expanded).not.toContain('hr.viewer');
    });
    
    test('should handle admin role expansion', () => {
      const userRoles = ['admin'];
      const expanded = RoleService.expandRoles(userRoles);
      
      expect(expanded).toContain('admin');
      expect(expanded).toContain('hr.admin');
      expect(expanded).toContain('finance.admin');
      expect(expanded).toContain('engineering.admin');
      expect(expanded).toContain('employee');
      expect(expanded).toContain('public');
    });
    
    test('should handle unknown roles gracefully', () => {
      const userRoles = ['unknown.role'];
      const expanded = RoleService.expandRoles(userRoles);
      
      expect(expanded).toContain('unknown.role');
      expect(expanded).toHaveLength(1);
    });
  });
  
  describe('canAccessDocument', () => {
    test('should allow access with matching role', () => {
      const userRoles = ['finance.viewer'];
      const docTags = ['role:finance.viewer'];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, docTags);
      expect(hasAccess).toBe(true);
    });
    
    test('should allow access through role hierarchy', () => {
      const userRoles = ['finance.admin'];
      const docTags = ['role:finance.viewer'];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, docTags);
      expect(hasAccess).toBe(true);
    });
    
    test('should deny access without matching role', () => {
      const userRoles = ['engineering.viewer'];
      const docTags = ['role:finance.viewer'];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, docTags);
      expect(hasAccess).toBe(false);
    });
    
    test('should allow access to documents with no role restrictions', () => {
      const userRoles = ['any.role'];
      const docTags: string[] = [];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, docTags);
      expect(hasAccess).toBe(true);
    });
  });
});
```

### Authentication Service Testing
```typescript
// AuthenticationService.test.ts
describe('AuthenticationService', () => {
  const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Valid test JWT
  const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Expired test JWT
  const invalidJWT = 'invalid.jwt.token';
  
  describe('verifyJWT', () => {
    test('should verify valid JWT', async () => {
      const claims = await AuthenticationService.verifyJWT(validJWT);
      
      expect(claims.sub).toBeDefined();
      expect(claims.roles).toBeInstanceOf(Array);
      expect(claims.tenant).toBeDefined();
    });
    
    test('should reject expired JWT', async () => {
      await expect(
        AuthenticationService.verifyJWT(expiredJWT)
      ).rejects.toThrow('JWT token has expired');
    });
    
    test('should reject invalid JWT', async () => {
      await expect(
        AuthenticationService.verifyJWT(invalidJWT)
      ).rejects.toThrow('JWT verification failed');
    });
    
    test('should reject empty JWT', async () => {
      await expect(
        AuthenticationService.verifyJWT('')
      ).rejects.toThrow('JWT token is required');
    });
  });
  
  describe('generateAccessPolicy', () => {
    test('should generate policy for finance user', () => {
      const claims = {
        sub: 'user@example.com',
        roles: ['finance.viewer'],
        tenant: 'acme',
        stepUp: false
      };
      
      const policy = AuthenticationService.generateAccessPolicy(claims);
      
      expect(policy.allowTags).toContain('role:finance.viewer');
      expect(policy.allowTags).toContain('role:employee');
      expect(policy.allowTags).toContain('role:public');
      expect(policy.allowTags).toContain('tenant:acme');
      expect(policy.maxClassification).toBe('internal');
    });
    
    test('should generate policy for HR user with stepUp', () => {
      const claims = {
        sub: 'user@example.com',
        roles: ['hr.admin'],
        tenant: 'acme',
        stepUp: true
      };
      
      const policy = AuthenticationService.generateAccessPolicy(claims);
      
      expect(policy.maxClassification).toBe('confidential');
    });
  });
});
```

### Agent Testing
```typescript
// agents.test.ts
describe('Agents', () => {
  describe('Identity Agent', () => {
    test('should extract JWT claims using tool', async () => {
      const mockJWT = 'valid.jwt.token';
      const mockClaims = {
        sub: 'user@example.com',
        roles: ['finance.viewer'],
        tenant: 'acme'
      };
      
      // Mock the JWT auth tool
      jest.spyOn(AuthenticationService, 'verifyJWT').mockResolvedValue(mockClaims);
      
      const result = await identityAgent.generate(JSON.stringify({ jwt: mockJWT }));
      
      expect(result).toContain('user@example.com');
      expect(result).toContain('finance.viewer');
    });
    
    test('should handle invalid JWT', async () => {
      const mockJWT = 'invalid.jwt.token';
      
      jest.spyOn(AuthenticationService, 'verifyJWT').mockRejectedValue(new Error('Invalid JWT'));
      
      const result = await identityAgent.generate(JSON.stringify({ jwt: mockJWT }));
      
      expect(result).toContain('error');
    });
  });
  
  describe('Answerer Agent', () => {
    test('should generate answer with citations', async () => {
      const input = {
        question: 'What is the expense policy?',
        contexts: [{
          text: 'Expense reports must be submitted within 30 days.',
          docId: 'finance-policy-001',
          source: 'Finance Policy Manual',
          score: 0.9,
          versionId: 'v1',
          securityTags: ['role:finance.viewer'],
          classification: 'internal'
        }]
      };
      
      const result = await answererAgent.generate(JSON.stringify(input), {
        experimental_output: ragAnswerSchema
      });
      
      expect(result.object.answer).toContain('30 days');
      expect(result.object.citations).toHaveLength(1);
      expect(result.object.citations[0].docId).toBe('finance-policy-001');
    });
    
    test('should handle no contexts', async () => {
      const input = {
        question: 'What is the expense policy?',
        contexts: []
      };
      
      const result = await answererAgent.generate(JSON.stringify(input), {
        experimental_output: ragAnswerSchema
      });
      
      expect(result.object.answer).toContain('No authorized documents found');
      expect(result.object.citations).toHaveLength(0);
    });
  });
});
```

## Integration Testing

### Workflow Testing
```typescript
// workflow.test.ts
describe('Governed RAG Workflow', () => {
  let testVectorStore: QdrantVector;
  let testDocuments: any[];
  
  beforeAll(async () => {
    // Setup test vector store
    testVectorStore = new QdrantVector({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY
    });
    
    // Index test documents
    testDocuments = [
      {
        filePath: './test/fixtures/finance-policy.md',
        docId: 'test-finance-001',
        classification: 'internal',
        allowedRoles: ['finance.viewer'],
        tenant: 'test-tenant',
        source: 'Test Finance Policy'
      }
    ];
    
    await indexTestDocuments(testDocuments);
  });
  
  afterAll(async () => {
    // Cleanup test data
    await cleanupTestDocuments();
  });
  
  test('should process query with proper authorization', async () => {
    const jwt = await generateTestJWT({ 
      roles: ['finance.viewer'], 
      tenant: 'test-tenant' 
    });
    const question = 'What is the expense policy?';
    
    const workflow = mastra.getWorkflows()['governed-rag-answer'];
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { jwt, question }
    });
    
    expect(result.status).toBe('success');
    expect(result.result.answer).toBeDefined();
    expect(result.result.citations).toHaveLength(1);
    expect(result.result.citations[0].docId).toBe('test-finance-001');
  });
  
  test('should deny access for unauthorized user', async () => {
    const jwt = await generateTestJWT({ 
      roles: ['engineering.viewer'], 
      tenant: 'test-tenant' 
    });
    const question = 'What is the expense policy?';
    
    const workflow = mastra.getWorkflows()['governed-rag-answer'];
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { jwt, question }
    });
    
    expect(result.status).toBe('success');
    expect(result.result.answer).toContain('No authorized documents found');
    expect(result.result.citations).toHaveLength(0);
  });
  
  test('should handle cross-tenant access prevention', async () => {
    const jwt = await generateTestJWT({ 
      roles: ['finance.viewer'], 
      tenant: 'other-tenant' 
    });
    const question = 'What is the expense policy?';
    
    const workflow = mastra.getWorkflows()['governed-rag-answer'];
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { jwt, question }
    });
    
    expect(result.status).toBe('success');
    expect(result.result.answer).toContain('No authorized documents found');
  });
});
```

### API Integration Testing
```typescript
// api.test.ts
describe('API Integration', () => {
  test('should handle chat request with valid JWT', async () => {
    const jwt = await generateTestJWT({ roles: ['finance.viewer'] });
    const question = 'What is the expense policy?';
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt, question })
    });
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    
    // Test streaming response
    const reader = response.body?.getReader();
    const chunks: string[] = [];
    
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      chunks.push(chunk);
    }
    
    const finalChunk = chunks[chunks.length - 1];
    expect(finalChunk).toContain('"done":true');
  });
  
  test('should reject request with invalid JWT', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: 'invalid', question: 'test' })
    });
    
    expect(response.status).toBe(500);
  });
});
```

## Security Testing

### Access Control Testing
```typescript
// security.test.ts
describe('Security Tests', () => {
  describe('Role-Based Access Control', () => {
    test('should prevent unauthorized document access', async () => {
      const userRoles = ['engineering.viewer'];
      const financeDocTags = ['role:finance.viewer'];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, financeDocTags);
      expect(hasAccess).toBe(false);
    });
    
    test('should allow hierarchical access', async () => {
      const userRoles = ['finance.admin'];
      const financeDocTags = ['role:finance.viewer'];
      
      const hasAccess = RoleService.canAccessDocument(userRoles, financeDocTags);
      expect(hasAccess).toBe(true);
    });
    
    test('should enforce tenant isolation', async () => {
      const allowTags = ['role:finance.viewer', 'tenant:acme'];
      const otherTenantDoc = {
        securityTags: ['role:finance.viewer', 'tenant:other-company']
      };
      
      // Simulate vector query filter
      const matchesTenant = allowTags.some(tag => 
        tag.startsWith('tenant:') && 
        otherTenantDoc.securityTags.includes(tag)
      );
      
      expect(matchesTenant).toBe(false);
    });
  });
  
  describe('JWT Security', () => {
    test('should reject tampered JWT', async () => {
      const tamperedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
      
      await expect(
        AuthenticationService.verifyJWT(tamperedJWT)
      ).rejects.toThrow('JWT verification failed');
    });
    
    test('should validate JWT expiration', async () => {
      const expiredClaims = {
        sub: 'user@example.com',
        roles: ['finance.viewer'],
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      };
      
      ValidationService.validateTokenExpiry(expiredClaims.exp);
      // Should throw error for expired token
    });
  });
  
  describe('Data Leakage Prevention', () => {
    test('should not leak information in error messages', async () => {
      try {
        await AuthenticationService.verifyJWT('invalid.jwt.token');
      } catch (error) {
        expect(error.message).not.toContain('secret');
        expect(error.message).not.toContain('key');
        expect(error.message).not.toContain('password');
      }
    });
    
    test('should verify answer uses only provided contexts', async () => {
      const contexts = [{
        text: 'Limited context about expenses',
        docId: 'test-doc',
        source: 'Test Source',
        score: 0.8,
        versionId: 'v1',
        securityTags: ['role:public'],
        classification: 'public'
      }];
      
      const answer = {
        answer: 'Based on external knowledge, the policy states...',
        citations: [{ docId: 'test-doc', source: 'Test Source' }]
      };
      
      const verification = await verifierAgent.generate(JSON.stringify({
        answer,
        question: 'What is the policy?',
        contexts
      }), {
        experimental_output: verificationResultSchema
      });
      
      expect(verification.object.ok).toBe(false);
      expect(verification.object.reason).toContain('external knowledge');
    });
  });
});
```

## Performance Testing

### Load Testing
```typescript
// performance.test.ts
describe('Performance Tests', () => {
  test('should handle concurrent requests', async () => {
    const jwt = await generateTestJWT({ roles: ['finance.viewer'] });
    const question = 'What is the expense policy?';
    
    const concurrentRequests = 10;
    const requests = Array(concurrentRequests).fill(null).map(() =>
      processQuery(jwt, question)
    );
    
    const startTime = Date.now();
    const results = await Promise.all(requests);
    const duration = Date.now() - startTime;
    
    // All requests should succeed
    results.forEach(result => {
      expect(result.status).toBe('success');
    });
    
    // Should complete within reasonable time
    expect(duration).toBeLessThan(30000); // 30 seconds
    
    console.log(`Processed ${concurrentRequests} requests in ${duration}ms`);
  });
  
  test('should handle large document indexing', async () => {
    const largeDocuments = generateLargeTestDocuments(100);
    
    const startTime = Date.now();
    const results = await DocumentIndexingService.indexDocuments(
      largeDocuments,
      testVectorStore,
      'test-index'
    );
    const duration = Date.now() - startTime;
    
    expect(results.every(r => r.status === 'success')).toBe(true);
    expect(duration).toBeLessThan(300000); // 5 minutes
    
    console.log(`Indexed ${largeDocuments.length} documents in ${duration}ms`);
  });
  
  test('should handle memory usage efficiently', async () => {
    const initialMemory = process.memoryUsage();
    
    // Process large batch of queries
    const queries = Array(50).fill(null).map((_, i) => ({
      jwt: generateTestJWT({ roles: ['finance.viewer'] }),
      question: `Test question ${i}`
    }));
    
    for (const query of queries) {
      await processQuery(query.jwt, query.question);
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Memory increase should be reasonable (less than 100MB)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
  });
});
```

## Test Utilities

### Test Data Generation
```typescript
// test-utils.ts
export async function generateTestJWT(claims: Partial<JWTClaims>): Promise<string> {
  const fullClaims = {
    sub: 'test@example.com',
    roles: ['public'],
    tenant: 'test-tenant',
    stepUp: false,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
    ...claims
  };
  
  return await new SignJWT(fullClaims)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'test-secret'));
}

export function generateTestDocuments(count: number): DocumentInput[] {
  return Array(count).fill(null).map((_, i) => ({
    filePath: `./test/fixtures/doc-${i}.md`,
    docId: `test-doc-${i}`,
    classification: i % 3 === 0 ? 'public' : i % 3 === 1 ? 'internal' : 'confidential',
    allowedRoles: [`role-${i % 5}`],
    tenant: 'test-tenant',
    source: `Test Document ${i}`
  }));
}

export async function cleanupTestData(): Promise<void> {
  // Clean up test documents from vector store
  // Clean up test database entries
  // Reset test state
}
```

### Mock Services
```typescript
// mocks.ts
export const mockVectorStore = {
  query: jest.fn(),
  createIndex: jest.fn(),
  upsert: jest.fn()
};

export const mockAuthenticationService = {
  verifyJWT: jest.fn(),
  generateAccessPolicy: jest.fn(),
  authenticateAndAuthorize: jest.fn()
};

export function setupMocks(): void {
  jest.spyOn(AuthenticationService, 'verifyJWT').mockImplementation(mockAuthenticationService.verifyJWT);
  jest.spyOn(AuthenticationService, 'generateAccessPolicy').mockImplementation(mockAuthenticationService.generateAccessPolicy);
}

export function resetMocks(): void {
  jest.clearAllMocks();
}
```

## Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000
};
```

### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:security": "jest --testPathPattern=security",
    "test:integration": "jest --testPathPattern=integration",
    "test:performance": "jest --testPathPattern=performance --runInBand"
  }
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      qdrant:
        image: qdrant/qdrant:latest
        ports:
          - 6333:6333
        options: >-
          --health-cmd "curl -f http://localhost:6333/health"
          --health-interval 30s
          --health-timeout 10s
          --health-retries 3
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test
        env:
          JWT_SECRET: test-secret
          QDRANT_URL: http://localhost:6333
      
      - name: Run security tests
        run: npm run test:security
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```