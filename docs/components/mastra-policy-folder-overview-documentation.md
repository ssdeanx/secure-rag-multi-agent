---
title: Mastra Policy Folder - Overview Documentation
component_path: `src/mastra/policy`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Security / Backend
tags: [folder, policy, security, yaml, documentation]
---

# Mastra Policy Folder Overview

Directory containing security policy configurations for the Governed RAG system, primarily ACL definitions in YAML format. Defines access rules for documents based on roles, tenants, and classifications.

## 1. Folder Overview

### Purpose/Responsibility

- OVR-001: Centralize access control policies for documents and resources.

- OVR-002: Scope: YAML files defining per-document rules (paths, allow roles, tenant, classification). Loaded by services like AuthenticationService. Excludes runtime enforcement.

- OVR-003: Context: Used during indexing/query to tag/filter documents per user roles.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration-driven security; declarative ACLs.

- ARC-002: Dependencies: YAML parser (implied); RoleService for inheritance.

- ARC-003: Interactions: Policies loaded to generate tags/filters for vector queries.

- ARC-004: Structure: Array of doc rules; each with path, allow.roles, tenant, classification.

### Folder Structure Diagram

```mermaid
graph TD
    PF[Policy Folder] --> ACL[acl.yaml]
    ACL --> D1[Doc: finance-policy.md]
    ACL --> D2[Doc: engineering-handbook.md]

    subgraph "Policy Rule"
        PR[path] --> PRR[allow.roles[]]
        PR --> PRT[tenant]
        PR --> PRC[classification]
    end

    D1 --> PR
    D2 --> PR

    classDiagram
        class PolicyRule {
            +path: string
            +allow: {roles: string[]}
            +tenant: string
            +classification: 'public'|'internal'|'confidential'
        }
        class ACLFile {
            +docs: PolicyRule[]
        }

        ACLFile --> PolicyRule
```

## 3. Interface Documentation

- INT-001: YAML array of rules.

| Field            | Purpose         | Type       | Example                               |
| ---------------- | --------------- | ---------- | ------------------------------------- |
| `path`           | Document file   | `string`   | `./corpus/finance-policy.md`          |
| `allow.roles`    | Permitted roles | `string[]` | `["finance.viewer", "finance.admin"]` |
| `tenant`         | Organization    | `string`   | `"acme"`                              |
| `classification` | Sensitivity     | `enum`     | `"internal"`                          |

### Schema (implied Zod)

```yaml
docs:
    - path: string
      allow:
          roles: string[]
      tenant: string
      classification: enum
```

INT notes:

- INT-003: Roles use inheritance via RoleService.

## 4. Implementation Details

- IMP-001: acl.yaml: Two sample rules for finance/engineering docs.

- IMP-002: Loading: Parsed to tags (role:finance.viewer, tenant:acme, classification:internal).

- IMP-003: Enforcement: Used in vector queries to filter results.

- IMP-004: Extension: Add rules for new docs.

Edge cases and considerations:

- No rules: Default public access?

- Invalid roles: Warn via RoleService.validate.

## 5. Usage Examples

### Policy Rule Addition

```yaml
- path: './corpus/hr-confidential.md'
  allow:
      roles: ['hr.admin']
  tenant: 'acme'
  classification: 'confidential'
```

### Loading in Service

```ts
// Pseudo: AuthenticationService.loadPolicies()
const policies = yaml.load(aclPath)
policies.docs.forEach((rule) => generateTags(rule))
```

Best practices:

- Use specific paths/roles.

- Group by tenant if multi-org.

## 6. Quality Attributes

- QUA-001 Security: Declarative; audit YAML for leaks.

- QUA-002 Performance: Static load; fast parsing.

- QUA-003 Reliability: Validate rules at startup.

- QUA-004 Maintainability: Human-readable YAML.

- QUA-005 Extensibility: Add fields (e.g., expires).

## 7. Reference Information

- REF-001: Dependencies: js-yaml (parser)

- REF-002: Configuration: acl.yaml in folder.

- REF-003: Testing: Load/validate rules.

- REF-004: Troubleshooting: Parse errors — check YAML syntax.

- REF-005: Related: RoleService.ts, AuthenticationService

- REF-006: Change history: 1.0 (2025-09-23)
