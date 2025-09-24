---
title: RoleHierarchyConfig - Technical Documentation
component_path: `src/mastra/config/role-hierarchy.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Security / Backend
tags: [config, roles, hierarchy, rbac, documentation]
---

# RoleHierarchyConfig Documentation

Configuration for RBAC hierarchy: ROLE_HIERARCHY map, levels, and utils (getRoleLevel, isValidRole, getInheritorRoles). Enables inheritance for access checks.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Define role inheritance and privilege levels for access control.

- OVR-002: Scope: Const hierarchy/levels; functions for level/valid/inheritors. Excludes enforcement.

- OVR-003: Context: Used by RoleService for expansion/filtering in auth/queries.

## 2. Architecture Section

- ARC-001: Design patterns: Hierarchical config with lookup utils.

- ARC-002: Dependencies: None (pure TS)

- ARC-003: Interactions: Hierarchy dict for inheritance; levels for sorting.

- ARC-004: Structure: Higher roles include lower (admin > dept admin > viewer > employee > public).

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    RH[RoleHierarchy] --> RHMap[{role: [inherited[]]}]
    RHMap --> Admin['admin': [all depts, employee, public]]
    RHMap --> DA['dept.admin': [viewer, employee, public]]
    RHMap --> RL[ROLE_LEVELS {role: number}]

    subgraph "Utils"
        RH --> GRL[getRoleLevel(role)] --> RL
        RH --> IVR[isValidRole(role)] --> RHMap
        RH --> GIR[getInheritorRoles(target)] --> RHMap
    end

    subgraph "Usage"
        RS[RoleService] --> RH
    end

    classDiagram
        class RoleHierarchy {
            +[role]: string[]
        }
        class Utils {
            +getRoleLevel(role): number
            +isValidRole(role): bool
            +getInheritorRoles(target): string[]
        }

        RoleHierarchyConfig --> Utils
```

## 3. Interface Documentation

- INT-001: Exports.

| Export | Purpose | Type | Notes |
|--------|---------|------|-------|
| `ROLE_HIERARCHY` | Inheritance map | `RoleHierarchy` | {admin: [...], ...} |
| `ROLE_LEVELS` | Privilege numbers | `Record<string, number>` | admin=100, public=10 |
| `getRoleLevel` | Get level | `(role: string) => number` | 0 if unknown |
| `isValidRole` | Check existence | `(role: string) => bool` | In hierarchy |
| `getInheritorRoles` | Find inheritors | `(target: string) => string[]` | Sorted by level |

### RoleHierarchy Type

```ts
interface RoleHierarchy {
  [role: string]: string[];
}
```

INT notes:

- INT-003: Sorted descending level.

## 4. Implementation Details

- IMP-001: Const map: admin inherits all; depts inherit viewer/employee/public.

- IMP-002: Levels: Numeric for comparison/sorting.

- IMP-003: Utils: Lookup or 0; in map; loop for includes + self, sort.

- IMP-004: No validation; assumes consistent.

Edge cases and considerations:

- Unknown role: 0 level, false valid, self in inheritors? No.

- Cycles: Not prevented; assume acyclic.

## 5. Usage Examples

### Inheritance Check

```ts
const level = getRoleLevel('admin'); // 100
const valid = isValidRole('hr.admin'); // true
const inheritors = getInheritorRoles('employee'); // ['admin', 'hr.admin', ...] sorted
```

### In Service

```ts
if (isValidRole(role)) {
  const inherited = ROLE_HIERARCHY[role] || [];
}
```

Best practices:

- Update map/levels together.

- Use for expansion in RoleService.

## 6. Quality Attributes

- QUA-001 Security: Defines access; no runtime.

- QUA-002 Performance: O(1) lookup; O(n) inheritors.

- QUA-003 Reliability: Const; immutable.

- QUA-004 Maintainability: Clear map.

- QUA-005 Extensibility: Add roles/levels.

## 7. Reference Information

- REF-001: Dependencies: None

- REF-002: None

- REF-003: Testing: Assert levels/inheritance.

- REF-004: Troubleshooting: Wrong inheritors — check map.

- REF-005: Related: RoleService.ts

- REF-006: Change history: 1.0 (2025-09-23)
