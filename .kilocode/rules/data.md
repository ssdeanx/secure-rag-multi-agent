# Data Governance Kilocode rule (data.md)

Scope
- Apply to ACL and corpus documents and indexing pipelines.
- Targets: [`src/mastra/policy/acl.yaml`](src/mastra/policy/acl.yaml:1), [`corpus/engineering-handbook.md`](corpus/engineering-handbook.md:1)

Principles
- ACL is authoritative: no ad-hoc classification in code or docs.
- Explicit metadata: every corpus document must carry canonical metadata.
- Traceability: changes to ACL or classification must be auditable.
- Least privilege: access and indexing obey classification and tenant tags.

Rules
1) ACL as single source
- The ACL file [`src/mastra/policy/acl.yaml`](src/mastra/policy/acl.yaml:1) is the canonical mapping of doc paths to roles, tenants, and classification.
- Changes to ACL must include: rationale, owner, affected doc list, and reviewer sign-off in the PR.

2) Corpus document metadata
- Every file under [`corpus/`](corpus/engineering-handbook.md:1) must include YAML frontmatter with required fields:
  - docId: stable identifier (string)
  - classification: public | internal | confidential
  - tenant: tenant id or global
  - roles: array of allowed roles (e.g., team:engineering)
  - source: origin or URL
  - lastReviewed: ISO 8601 date
- Example frontmatter:
```
---
docId: engineering-handbook-2025-09
classification: internal
tenant: engineering
roles:
- role:engineering
source: corpus/engineering-handbook.md
lastReviewed: 2025-09-23
---
```

3) Indexing and ACL reconciliation
- Document indexing must resolve classification and allowed roles using the ACL file only; if a document contains conflicting metadata, ACL wins.
- Indexing service must record both document metadata and resolved securityTags in vector metadata.
- Reference implementation: [`src/mastra/services/DocumentIndexingService.ts`](src/mastra/services/DocumentIndexingService.ts:1)

4) Sensitive document access
- Tools and agents querying vectors must only return results whose securityTags satisfy the caller JWT claims.
- Confidential documents must never be exposed to unauthenticated or insufficiently privileged callers.

5) Audit and retention
- Changes to ACL and corpus classification must be logged with actor, timestamp, and PR id.
- Indexing runs must emit processing traces including docId, batch ids, and vector ids.

Checklist for reviewers
- [ ] ACL updates include rationale and affected doc list
- [ ] Corpus docs include valid frontmatter with docId and classification
- [ ] DocumentIndexingService uses ACL for final classification
- [ ] Sensitive docs marked confidential are restricted by RoleService filters
- [ ] Audit entries added to change log

Enforcement suggestions (non-invasive)
- Provide a validation script template that checks frontmatter and ACL consistency (run locally or in CI if desired).
- Add reviewer checklist to PR template; do not modify repo without approval.

Next steps
- File written to .kilocode/rules/data.md as draft.