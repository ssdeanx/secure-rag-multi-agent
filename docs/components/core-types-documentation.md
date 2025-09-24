---
title: Core Types - Technical Documentation
component_path: `src/types.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [types, interfaces, typescript, documentation]
---

# Core Types Documentation

TypeScript interface definitions for the Mastra governed RAG system. Defines core data structures for authentication, access control, documents, and text chunks used throughout the application.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Define TypeScript interfaces for core domain entities.

- OVR-002: Scope includes authentication principals, access filters, document metadata, and text chunk structures. It deliberately excludes implementation details and focuses on type contracts.

- OVR-003: Context: Imported by services, agents, and workflows to ensure type safety across the application.

## 2. Architecture Section

- ARC-001: Design patterns: Type definition module pattern. Pure type declarations with no runtime behavior.

- ARC-002: Dependencies:

  - None (pure TypeScript types)

- ARC-003: Interactions: Used by TypeScript compiler for type checking and IntelliSense. No runtime interactions.

- ARC-004: Visual/behavioral decisions: Simple interface definitions with optional fields and union types for classifications.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Core Types Module"
        CT[types.ts] --> P[Principal]
        CT --> AF[AccessFilter]
        CT --> D[Document]
        CT --> C[Chunk]
    end

    subgraph "Consumers"
        S[Services] --> CT
        A[Agents] --> CT
        W[Workflows] --> CT
    end

    classDiagram
        class Principal {
            +sub: string
            +roles: string[]
            +tenant?: string
            +attrs?: Record<string, unknown>
        }

        class AccessFilter {
            +allowTags: string[]
            +maxClassification: "public"|"internal"|"confidential"
        }

        class Document {
            +docId: string
            +versionId: string
            +uri: string
            +owner?: string
            +labels?: string[]
            +securityTags: string[]
            +hash: string
            +createdAt: string
        }

        class Chunk {
            +chunkId: string
            +docId: string
            +versionId: string
            +text: string
            +span: {start: number, end: number}
            +meta?: {page?: number, section?: string}
            +securityTags: string[]
        }
```

## 3. Interface Documentation

- INT-001: TypeScript interface definitions for core entities.

| Interface | Purpose | Key Properties | Usage Notes |
|-----------|---------|----------------|-------------|
| `Principal` | User identity and permissions | `sub`, `roles`, `tenant`, `attrs` | Authentication context |
| `AccessFilter` | Security filtering rules | `allowTags`, `maxClassification` | Vector query filtering |
| `Document` | Document metadata | `docId`, `securityTags`, `hash` | Document storage |
| `Chunk` | Text chunk with metadata | `text`, `span`, `securityTags` | Vector embeddings |

### Principal Interface

```ts
interface Principal {
  sub: string;                    // Subject identifier (user ID)
  roles: string[];               // User roles for access control
  tenant?: string;               // Optional tenant identifier
  attrs?: Record<string, unknown>; // Additional attributes (e.g., stepUp)
}
```

### AccessFilter Interface

```ts
interface AccessFilter {
  allowTags: string[];           // Security tags for filtering
  maxClassification: "public" | "internal" | "confidential"; // Max allowed classification
}
```

### Document Interface

```ts
interface Document {
  docId: string;                 // Unique document identifier
  versionId: string;             // Version identifier
  uri: string;                   // Document location
  owner?: string;                // Optional owner identifier
  labels?: string[];             // Optional labels
  securityTags: string[];        // Denormalized ACL tags
  hash: string;                  // Content hash for integrity
  createdAt: string;             // ISO timestamp
}
```

### Chunk Interface

```ts
interface Chunk {
  chunkId: string;               // Unique chunk identifier
  docId: string;                 // Parent document ID
  versionId: string;             // Parent document version
  text: string;                  // Chunk text content
  span: { start: number; end: number }; // Text span in document
  meta?: { page?: number; section?: string }; // Optional metadata
  securityTags: string[];        // Inherited security tags
}
```

## 4. Implementation Details

- IMP-001: All interfaces are pure TypeScript declarations with no runtime code.
- IMP-002: Optional fields use `?` syntax for flexibility.
- IMP-003: Union types used for classification levels.
- IMP-004: Nested objects for complex structures like spans and metadata.

Corner cases and considerations:

- `securityTags` arrays may be empty for public content.
- `attrs` allows arbitrary extension without breaking contracts.
- `span` provides text position for debugging and citations.

## 5. Usage Examples

### Using Principal in authentication

```ts
import { Principal } from '@/src/types';

function authenticateUser(token: string): Principal {
  // Decode JWT and return typed principal
  return {
    sub: 'user@acme.com',
    roles: ['employee'],
    tenant: 'acme',
    attrs: { stepUp: false }
  };
}
```

### AccessFilter for queries

```ts
import { AccessFilter } from '@/src/types';

const filter: AccessFilter = {
  allowTags: ['role:employee', 'tenant:acme'],
  maxClassification: 'internal'
};
```

### Document metadata

```ts
import { Document } from '@/src/types';

const doc: Document = {
  docId: 'doc-123',
  versionId: 'v1.0',
  uri: '/docs/policy.pdf',
  securityTags: ['role:hr.viewer'],
  hash: 'sha256:...',
  createdAt: '2025-09-23T10:00:00Z'
};
```

### Text chunk structure

```ts
import { Chunk } from '@/src/types';

const chunk: Chunk = {
  chunkId: 'chunk-456',
  docId: 'doc-123',
  versionId: 'v1.0',
  text: 'Company vacation policy...',
  span: { start: 100, end: 200 },
  securityTags: ['role:hr.viewer']
};
```

## 6. Quality Attributes

- QUA-001 Security: Security tags and classifications built into type system.
- QUA-002 Performance: Pure types with zero runtime overhead.
- QUA-003 Reliability: TypeScript compilation ensures type safety.
- QUA-004 Maintainability: Centralized type definitions prevent duplication.
- QUA-005 Extensibility: Optional fields and attrs allow evolution.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - None

- REF-002: Configuration
  - No configuration; types are static.

- REF-003: Testing guidelines
  - Type checking via TypeScript compiler.
  - Runtime validation with Zod schemas.

- REF-004: Troubleshooting
  - Type errors indicate interface mismatches.
  - Update types when domain model changes.

- REF-005: Related docs
  - Agent schemas in `src/mastra/schemas/agent-schemas.ts`
  - Service interfaces using these types

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated