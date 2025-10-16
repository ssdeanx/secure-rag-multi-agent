# Security Model

The Mastra Governed RAG implements a robust security framework using role-based access control (RBAC) with hierarchical inheritance, document classifications, and policy enforcement at each stage of the RAG pipeline. Security is integrated into the Mastra workflows to ensure users only access authorized content.

## Role Hierarchy

Roles are defined in [`src/mastra/config/role-hierarchy.ts`](../src/mastra/config/role-hierarchy.ts). Higher-level roles inherit permissions from lower ones, allowing granular access control.

### Role Structure

- **public** (Level 10): Base access for unauthenticated users. No inheritance.
- **employee** (Level 40): Inherits `public`. Access to general company documents.
- **Department Viewer Roles** (Level 60): Read access to department-specific content + general access.
    - `hr.viewer`: Inherits `employee`, `public`.
    - `finance.viewer`: Inherits `employee`, `public`.
    - `engineering.viewer`: Inherits `employee`, `public`.
- **Department Admin Roles** (Level 80): Full access to department + lower levels.
    - `hr.admin`: Inherits `hr.viewer`, `employee`, `public`.
    - `finance.admin`: Inherits `finance.viewer`, `employee`, `public`.
    - `engineering.admin`: Inherits `engineering.viewer`, `employee`, `public`.
- **admin** (Level 100): Super admin. Inherits all roles: `hr.admin`, `hr.viewer`, `finance.admin`, `finance.viewer`, `engineering.admin`, `engineering.viewer`, `employee`, `public`.

### Inheritance and Privilege Levels

- Roles inherit all permissions from listed lower roles.
- Privilege levels enable sorting and comparison (higher number = more access).
- Valid roles: Only those defined in the hierarchy are recognized.
- Inheritor roles: For a given role, all roles that can access it (e.g., `public` is accessible by everyone).

Example: A `finance.viewer` can access `public` and `employee` content but not HR confidential documents.

## Document Classifications and Access Policies

Documents are classified during indexing ([`/api/index`](../app/api/index/route.ts)) with metadata enforced in storage and retrieval.

### Classifications

- **public**: Accessible by all roles (e.g., general info).
- **internal**: Department-specific or sensitive internal docs. Accessible by employee + relevant department roles.
- **confidential**: Highly sensitive (e.g., executive comp, legal). Restricted to admins of specific departments.

### Sample Corpus Classifications

Based on filename and content in `./corpus/`:

- **`finance-policy.md`** (Finance Department Policy Manual):
    - Classification: `internal`
    - Allowed Roles: `['finance.viewer', 'finance.admin', 'employee']` (inherits public access)
    - Tags: Implicit finance/policy tags for filtering.

- **`engineering-handbook.md`** (Engineering Team Handbook):
    - Classification: `internal`
    - Allowed Roles: `['engineering.admin', 'engineering.viewer', 'employee']`
    - Tags: Engineering/dev practices.

- **`hr-confidential.md`** (HR Confidential - Executive Compensation):
    - Classification: `confidential`
    - Allowed Roles: `['hr.admin']` (strict; no inheritance beyond admin)
    - Tags: HR/executive, confidential.

### Security Tags

- Each document chunk stores `securityTags: string[]` (e.g., `['finance', 'policy']`).
- Access filter includes `allowTags: string[]` derived from user roles (e.g., `finance.viewer` → `['finance']`).
- Retrieval queries filter by:
    - `maxClassification`: Role's highest allowed (e.g., employee: internal; hr.admin: confidential).
    - Matching tags in `allowedRoles` and `securityTags`.

## Policy Enforcement

Security is enforced end-to-end via the Mastra query workflow ([governed-rag-answer](../src/mastra/workflows/governed-rag-answer.workflow.ts)):

1. **Authentication Step**:
    - Validate JWT via `AuthenticationService`.
    - Generate `accessFilter`: `{ maxClassification: string, allowTags: string[] }` based on role inheritance.
    - Example: `finance.viewer` → `maxClassification: 'internal'`, `allowTags: ['finance']`.

2. **Retrieval Step**:
    - `retrieveAgent` uses `vector-query.tool` to query PostgreSQL with PgVector, filtering by `accessFilter`.
    - Only returns contexts where chunk classification ≤ maxClassification and tags match.
    - If no results: "No authorized documents found."

3. **Rerank and Answer Steps**:
    - `rerankAgent` and `answererAgent` process only authorized contexts.
    - Citations limited to accessible docs.

4. **Verification Step**:
    - `verifierAgent` checks answer for compliance (no leakage of unauthorized info).
    - If violation: Workflow fails with error.

### Indexing Security

- During indexing ([governed-rag-index](../src/mastra/workflows/governed-rag-index.workflow.ts)):
    - `DocumentIndexingService` embeds chunks with metadata: `{ docId, classification, allowedRoles, securityTags, tenant }`.
    - Stored in PostgreSQL with PgVector with payload for filtering.
    - CLI (`npm run cli index`) uses predefined metadata for corpus.

### Additional Policies

- **Tenant Isolation**: All docs scoped to `tenant: 'acme'` (configurable in `.env`).
- **Audit Logging**: All workflow steps logged to `logs/mastra.log` and `logs/workflow.log`.
- **ACL Configuration**: Base policies in `src/mastra/policy/acl.yaml` (extend for custom rules).
- **JWT Auth**: Tokens include claims with role; validated via `jwt-auth.tool`.

## Best Practices

- **Role Assignment**: Use least privilege; assign via UI or external auth.
- **Document Tagging**: When adding docs, specify classification/roles in indexing payload.
- **Testing Access**: Use [Demo Roles](./demo-roles.md) to simulate scenarios.
- **Compliance**: Classifications align with standards (e.g., confidential = need-to-know).

For API details on auth, see [API Reference](./api-reference.md). Extend roles in role-hierarchy.ts and rebuild.
