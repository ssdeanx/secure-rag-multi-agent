---
title: RoleService - Technical Documentation
component_path: `src/mastra/services/RoleService.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Security / Backend
tags: [service, rbac, roles, hierarchy, documentation]
---

# RoleService Documentation

Static class implementing RBAC logic: role expansion, access checks, tag generation, validation, logging. Uses role-hierarchy config for inheritance.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Manage role-based access with inheritance and filtering.

- OVR-002: Scope: Static methods for expand/canAccess/generateTags/etc. Excludes config (hierarchy.ts).

- OVR-003: Context: Used in auth/queries for user effective roles/tags.

## 2. Architecture Section

- ARC-001: Design patterns: Utility service with static methods.

- ARC-002: Dependencies: Local role-hierarchy (ROLE_HIERARCHY, utils)

- ARC-003: Interactions: Input userRoles → expanded/tags; checks against required/doc tags.

- ARC-004: Sets for uniqueness; sort by level desc.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    RS[RoleService] --> ER[expandRoles(userRoles)]
    RS --> CAR[canAccessRole(user, required)]
    RS --> CAD[canAccessDocument(user, docTags)]
    RS --> GAT[generateAccessTags(user, tenant?)]
    RS --> GPL[getMaxPrivilegeLevel(user)]
    RS --> FRL[formatRolesForLogging(user)]
    RS --> VDR[validateDocumentRoles(doc)]
    RS --> GDAR[getDocumentAccessibleRoles(doc)]

    subgraph "Core"
        ER --> RH[ROLE_HIERARCHY]
        GAT --> RH
        GDAR --> GIR[getInheritorRoles]
    end

    subgraph "External"
        RH[role-hierarchy.ts] --> RS
    end

    classDiagram
        class RoleService {
            +static expandRoles(roles): string[]
            +static canAccessRole(user, required): bool
            +static generateAccessTags(roles, tenant?): {allowTags, userRoles, expanded}
        }
        class HierarchyUtils {
            +getRoleLevel(role): number
            +isValidRole(role): bool
            +getInheritorRoles(target): string[]
        }

        RoleService --> HierarchyUtils
```

## 3. Interface Documentation

- INT-001: Static methods.

| Method | Purpose | Parameters | Return Type | Notes |
|--------|---------|------------|-------------|-------|
| `expandRoles` | Add inherited | `string[] userRoles` | `string[]` | Sorted desc level; warns unknown |
| `canAccessRole` | Check role | `string[] user, string required` | `bool` | Via expand |
| `canAccessDocument` | Check doc tags | `string[] user, string[] docTags` | `bool` | Some match; empty=true |
| `generateAccessTags` | Tags for query | `string[] user, string? tenant` | `{allowTags[], user/expanded[]}` | role:/tenant: |
| `getMaxPrivilegeLevel` | Highest level | `string[] user` | `number` | Max from levels |
| `formatRolesForLogging` | Log string | `string[] user` | `string` | Original/effective/max |
| `validateDocumentRoles` | Check roles | `string[] doc` | `{valid: bool, warnings[]}` | Unknown roles |
| `getDocumentAccessibleRoles` | Inheritors for doc | `string[] doc` | `string[]` | Sorted; self + inheritors |

INT notes:

- INT-003: Uses Sets for unique; sort by level.

## 4. Implementation Details

- IMP-001: expand: Set add role/inherited; warn unknown; sort desc level.

- IMP-002: canAccess: expand includes required/doc tag match.

- IMP-003: generate: Map to role:; add tenant:; return with arrays.

- IMP-004: Others: Loop max level; format join; validate loop; getInheritors loop includes.

Edge cases and considerations:

- Empty user: No access unless public.

- Unknown: Warn/add self.

## 5. Usage Examples

### Expansion

```ts
const expanded = RoleService.expandRoles(['employee']); // ['employee', 'public']
```

### Access Check

```ts
const canView = RoleService.canAccessDocument(['hr.admin'], ['role:employee']); // true
```

### Tags

```ts
const tags = RoleService.generateAccessTags(['admin'], 'acme');
// {allowTags: ['role:admin', ... , 'tenant:acme'], ...}
```

Best practices:

- Always expand before checks.

- Log formatted for audits.

## 6. Quality Attributes

- QUA-001 Security: Inheritance expands access correctly.

- QUA-002 Performance: O(n) loops; fine for roles<20.

- QUA-003 Reliability: Warns unknown; Sets unique.

- QUA-004 Maintainability: Static; clear methods.

- QUA-005 Extensibility: Add methods (e.g., diffRoles).

## 7. Reference Information

- REF-001: Dependencies: role-hierarchy.ts

- REF-002: None

- REF-003: Testing: Assert expansion/access.

- REF-004: Troubleshooting: Wrong access — check hierarchy.

- REF-005: Related: AuthenticationService

- REF-006: Change history: 1.0 (2025-09-23)