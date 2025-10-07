# Memory Bank: Rule Rationales

## Mastra Rule (mastra.md)

- **Agent Contracts**: Prevents ad-hoc tool usage; ensures agents are predictable and auditable. Rationale: Agents in RAG systems can access sensitive data; explicit contracts prevent over-permissive access.
- **Tool Approvals**: Network/fs tools are high-risk; approvals ensure minimal privilege and traceability. Rationale: Prevents data exfiltration or unauthorized writes; aligns with least privilege.
- **Vector Store Safety**: Embedding mismatches cause failures; securityTags prevent data leaks. Rationale: Vector stores hold classified data; validation prevents corruption and unauthorized access.
- **Indexing and ACL**: ACL as single source prevents conflicting classifications. Rationale: Ensures consistent governance across indexing and queries.
- **Output Verification**: Citations and verification prevent hallucinated answers. Rationale: RAG must be trustworthy; verifier agent adds confidence layer.

## Data Governance Rule (data.md)

- **ACL as Single Source**: Centralizes classification logic. Rationale: Prevents scattered policies that lead to inconsistencies and security gaps.
- **Corpus Metadata**: Frontmatter ensures documents are self-describing. Rationale: Metadata drives access control; missing fields cause indexing failures or leaks.
- **Indexing Reconciliation**: ACL overrides doc metadata to enforce policy. Rationale: Documents may have outdated metadata; ACL is authoritative.
- **Sensitive Access**: Filters prevent exposure of confidential data. Rationale: Least privilege; confidential docs must be restricted.
- **Audit and Retention**: Logs changes for compliance. Rationale: Regulatory requirements; traceability for incidents.

## Tools Rule (tools.md)

- **Approval Metadata**: Explicit justification and whitelists. Rationale: Tools perform side-effects; approvals ensure they are necessary and controlled.
- **Network Controls**: Validation and sanitization prevent malicious fetches. Rationale: External content can contain malware; robots rules respect site policies.
- **Filesystem Gating**: Sandboxing prevents repo corruption. Rationale: Writes can overwrite critical files; atomic operations ensure consistency.
- **Interface Contracts**: Schemas prevent misuse. Rationale: Tools are called by agents; clear contracts reduce errors.
- **Auditing**: Traces enable incident response. Rationale: Side-effects must be reversible and logged for accountability.

## Security Rule (security.md)

- **Secrets and Config**: No committed secrets prevent leaks. Rationale: Secrets in repo are accessible to anyone with access; env vars are runtime-only.
- **Runtime Validation**: Fail-fast prevents runtime errors. Rationale: Misconfig can expose data or cause crashes; validation at startup catches issues early.
- **Embedding Checks**: Dimension mismatches corrupt vectors. Rationale: Wrong dimensions cause query failures; explicit mapping ensures compatibility.
- **Secrets Access**: Centralized accessor prevents scattered reads. Rationale: Easier rotation and auditing; avoids direct env access.
- **Transport Security**: TLS prevents interception. Rationale: Data in transit must be encrypted; logs without secrets protect privacy.
