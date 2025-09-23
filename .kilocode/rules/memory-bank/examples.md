# Memory Bank: Examples and Remediation

## Mastra Rule Examples

### Agent Contracts
**Example Violation**: Agent file without Kilocode header.
```typescript
// BAD: No header
export const assistantAgent = new Agent({ ... });
```

**Remediation**: Add header with contract details.
```typescript
// GOOD: With header
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::AnswererOutput
export const assistantAgent = new Agent({ ... });
```

### Tool Approvals
**Example Violation**: Tool without approval header.
```typescript
// BAD: No approval
export const webScraperTool = { ... };
```

**Remediation**: Add approval metadata.
```typescript
// GOOD: With approval
// Kilocode: Tool Approval
// owner: team-data
// justification: fetch public docs for RAG indexing
// allowedDomains:
//  - example.com
// approvedBy: alice
// approvalDate: 2025-09-23
export const webScraperTool = { ... };
```

### Vector Store Safety
**Example Violation**: Upsert without securityTags.
```typescript
// BAD: No security tags
await vectorStore.upsert({ id, vector: embedding });
```

**Remediation**: Include securityTags.
```typescript
// GOOD: With security tags
await vectorStore.upsert({
  id,
  vector: embedding,
  metadata: { securityTags: { role: 'engineering', tenant: 'global' } }
});
```

## Data Governance Rule Examples

### ACL as Single Source
**Example Violation**: Classification in code instead of ACL.
```typescript
// BAD: Hardcoded classification
const classification = 'confidential';
```

**Remediation**: Read from ACL file.
```typescript
// GOOD: Use ACL
import { readAcl } from './acl';
const acl = readAcl();
const classification = acl.getClassification(docPath);
```

### Corpus Metadata
**Example Violation**: Document without frontmatter.
```markdown
# Document Title
Content without metadata.
```

**Remediation**: Add YAML frontmatter.
```markdown
---
docId: engineering-handbook-2025-09
classification: internal
tenant: engineering
roles:
- role:engineering
source: corpus/engineering-handbook.md
lastReviewed: 2025-09-23
---

# Document Title
Content with metadata.
```

## Tools Rule Examples

### Network Controls
**Example Violation**: Unvalidated fetch.
```typescript
// BAD: No validation
const response = await fetch(url);
```

**Remediation**: Validate domain and sanitize.
```typescript
// GOOD: With validation
if (!validateUrl(url, allowedDomains)) throw new Error('Invalid domain');
const response = await fetch(url);
const content = sanitizeHtml(await response.text());
```

### Filesystem Gating
**Example Violation**: Direct write outside DATA_DIR.
```typescript
// BAD: Direct write
await fs.writeFile('/tmp/file.txt', content);
```

**Remediation**: Use validateDataPath and DATA_DIR.
```typescript
// GOOD: Sandboxed write
const safePath = validateDataPath(path.join(DATA_DIR, 'file.txt'));
await fs.writeFile(safePath, content);
```

## Security Rule Examples

### Secrets Access
**Example Violation**: Direct process.env access.
```typescript
// BAD: Direct access
const apiKey = process.env.API_KEY;
```

**Remediation**: Use centralized accessor.
```typescript
// GOOD: Centralized
import { getSecret } from './secrets';
const apiKey = getSecret('API_KEY');
```

### Embedding Checks
**Example Violation**: No dimension validation.
```typescript
// BAD: No check
await vectorStore.upsert({ id, vector: embedding });
```

**Remediation**: Validate dimension.
```typescript
// GOOD: With check
if (embedding.length !== EXPECTED_DIM) {
  throw new Error('Embedding dimension mismatch');
}
await vectorStore.upsert({ id, vector: embedding });
```

### Transport Security
**Example Violation**: HTTP instead of HTTPS.
```typescript
// BAD: Insecure
const client = new VectorStoreClient('http://localhost:6333');
```

**Remediation**: Use TLS.
```typescript
// GOOD: Secure
const client = new VectorStoreClient('https://secure-vector-store.com');