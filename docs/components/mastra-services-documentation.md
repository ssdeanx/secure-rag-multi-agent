---
title: "Mastra Services - Technical Documentation"
component_path: "src/mastra/services"
version: "1.0"
date_created: "2025-09-23"
last_updated: "2025-09-23"
owner: "AI Team"
tags: ["service", "authentication", "validation", "role-management", "vector-query", "security", "infrastructure"]
---

# Mastra Services Documentation

A comprehensive collection of service classes that provide core business logic for authentication, validation, role-based access control, and vector database querying in the Mastra Governed RAG system.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide core business logic services for the Mastra RAG system
- OVR-002: Handle authentication, authorization, and access control
- OVR-003: Manage vector database queries with security filtering
- OVR-004: Validate inputs and ensure data integrity
- OVR-005: Implement role hierarchy and permission management

## 2. Architecture Section

- ARC-001: Service-oriented architecture with static utility classes
- ARC-002: Dependency injection through static method calls
- ARC-003: Hierarchical role-based access control (RBAC) system
- ARC-004: JWT token validation and claims processing
- ARC-005: Vector similarity search with security filtering

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Service Layer"
        A[AuthenticationService] --> B[ValidationService]
        A --> C[RoleService]
        D[VectorQueryService] --> B
        D --> C
        E[Other Services] --> B
    end

    subgraph "External Dependencies"
        F[JWT Library - jose]
        G[AI SDK - @ai-sdk/google]
        H[Vector Store - Qdrant]
        I[Role Hierarchy Config]
        J[Logger]
    end

    subgraph "Data Flow"
        K[JWT Token] --> A
        L[User Roles] --> C
        M[Query Request] --> D
        N[Security Filters] --> D
    end

    A --> F
    D --> G
    D --> H
    C --> I
    A --> J
    D --> J

    classDiagram
        class AuthenticationService {
            +verifyJWT(token: string): Promise~JWTClaims~
            +generateAccessPolicy(claims: JWTClaims): AccessFilter
            +authenticateAndAuthorize(token: string): Promise~{claims, accessFilter}~
        }
        class ValidationService {
            +validateEnvironmentVariable(name, value): string
            +validateJWTToken(jwt): string
            +validateQuestion(question): string
            +validateTokenExpiry(exp, now): void
        }
        class RoleService {
            +expandRoles(userRoles): string[]
            +canAccessRole(userRoles, requiredRole): boolean
            +generateAccessTags(userRoles, tenant): {allowTags, userRoles, expandedRoles}
            +getMaxPrivilegeLevel(userRoles): number
        }
        class VectorQueryService {
            +buildSecurityFilters(allowTags, maxClassification): SecurityFilters
            +generateQueryEmbedding(question): Promise~number[]~
            +searchWithFilters(embedding, filters, vectorStore, indexName, topK): Promise~QueryResult[]~
            +query(input, vectorStore, indexName): Promise~QueryResult[]~
        }

        AuthenticationService --> ValidationService
        AuthenticationService --> RoleService
        VectorQueryService --> ValidationService
        VectorQueryService --> RoleService
```

## 3. Interface Documentation

- INT-001: Static utility methods for all services
- INT-002: TypeScript interfaces for data structures
- INT-003: Promise-based async operations

| Method/Property | Purpose | Parameters | Return Type | Usage Notes |
|---|---|---|---|---|
| `AuthenticationService.verifyJWT()` | Validate JWT token and extract claims | `token: string` | `Promise<JWTClaims>` | Throws on invalid/expired tokens |
| `AuthenticationService.generateAccessPolicy()` | Generate access filter from claims | `claims: JWTClaims` | `AccessFilter` | Uses role hierarchy expansion |
| `AuthenticationService.authenticateAndAuthorize()` | Complete auth flow | `token: string` | `Promise<{claims, accessFilter}>` | Combines verification and policy generation |
| `ValidationService.validateEnvironmentVariable()` | Check env var presence | `name: string, value?: string` | `string` | Throws if missing |
| `ValidationService.validateJWTToken()` | Validate JWT format | `jwt?: string` | `string` | Throws if invalid |
| `ValidationService.validateQuestion()` | Check question validity | `question?: string` | `string` | Throws if empty |
| `RoleService.expandRoles()` | Expand roles with inheritance | `userRoles: string[]` | `string[]` | Returns sorted by privilege level |
| `RoleService.canAccessRole()` | Check role-based access | `userRoles: string[], requiredRole: string` | `boolean` | Uses role hierarchy |
| `RoleService.generateAccessTags()` | Generate query filter tags | `userRoles: string[], tenant?: string` | `{allowTags, userRoles, expandedRoles}` | Includes tenant filtering |
| `VectorQueryService.buildSecurityFilters()` | Create security filters | `allowTags: string[], maxClassification` | `SecurityFilters` | Maps classification to allowed classes |
| `VectorQueryService.generateQueryEmbedding()` | Create text embedding | `question: string` | `Promise<number[]>` | Uses Google AI embeddings |
| `VectorQueryService.searchWithFilters()` | Execute filtered search | `embedding, filters, vectorStore, indexName, topK, minSimilarity` | `Promise<QueryResult[]>` | Applies security and similarity filtering |
| `VectorQueryService.query()` | Main query interface | `input: QueryInput, vectorStore, indexName` | `Promise<QueryResult[]>` | Orchestrates full query process |

## 4. Implementation Details

- IMP-001: Static utility classes for stateless operations
- IMP-002: JWT verification using jose library with HS256
- IMP-003: Role hierarchy expansion for access control
- IMP-004: Vector similarity search with Qdrant filtering
- IMP-005: Comprehensive input validation and error handling

## 5. Usage Examples

### Basic Usage

```typescript
// JWT Authentication
const { claims, accessFilter } = await AuthenticationService.authenticateAndAuthorize(token);

// Role-based access check
const canAccess = RoleService.canAccessRole(userRoles, 'admin');

// Vector query with security
const results = await VectorQueryService.query({
  question: "What is the company policy?",
  allowTags: ["hr", "policies"],
  maxClassification: "internal"
}, vectorStore, "documents");
```

### Advanced Usage

```typescript
// Custom validation
ValidationService.validateEnvironmentVariable("API_KEY", process.env.API_KEY);

// Role hierarchy expansion
const expandedRoles = RoleService.expandRoles(['employee']); // Returns ['employee', 'user', 'public']

// Security filter building
const filters = VectorQueryService.buildSecurityFilters(
  ['role:hr', 'role:employee'], 
  'internal'
); // Returns allowed classes for internal and public
```

- USE-001: Authentication and authorization workflows
- USE-002: Role hierarchy and access control
- USE-003: Vector database querying with security filters

## 6. Quality Attributes

- QUA-001: Security - JWT validation, role-based access control, classification filtering
- QUA-002: Performance - Efficient vector search, cached embeddings, optimized queries
- QUA-003: Reliability - Comprehensive validation, error handling, token expiry checks
- QUA-004: Maintainability - Static methods, clear interfaces, extensive logging
- QUA-005: Extensibility - Modular services, configurable role hierarchy, pluggable vector stores

## 7. Reference Information

- REF-001: Dependencies: jose (^4.0.0), @ai-sdk/google (^0.0.0), Qdrant client
- REF-002: Environment variables: JWT_SECRET, EMBEDDING_MODEL, QDRANT_URL
- REF-003: Testing: Unit tests for each service method, integration tests for auth flow
- REF-004: Troubleshooting: JWT expiry errors, role hierarchy issues, vector store connectivity
- REF-005: Related: ../config/role-hierarchy.ts, ../tools/vector-query.tool.ts
- REF-006: Change history: Initial implementation with RBAC, added vector security filtering