---
title: Role Hierarchy Configuration - Technical Documentation
component_path: `src/mastra/config/role-hierarchy.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, roles, hierarchy, access-control, documentation]
---

# Role Hierarchy Configuration Documentation

Configuration module defining the hierarchical relationships between user roles for role-based access control (RBAC). Establishes inheritance chains where higher-privilege roles automatically gain access to lower-privilege resources.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Define and manage the role hierarchy for the application's RBAC system.

- OVR-002: Scope includes role inheritance mappings, privilege levels, and utility functions for role validation and level comparison. It deliberately excludes business logic (access decisions) which belongs in services.

- OVR-003: Context: Imported by `RoleService` and other access control components to enforce hierarchical permissions.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module pattern. Exports constants and pure functions for role operations.

- ARC-002: Dependencies:

  - None (pure configuration module)

- ARC-003: Interactions: Provides read-only data structures and utility functions. No side effects.

- ARC-004: Visual/behavioral decisions: Hierarchical structure with admin → department admin → department viewer → employee → public. Privilege levels use numeric values for easy comparison.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Role Hierarchy Module"
        RH[role-hierarchy.ts] --> RHC[ROLE_HIERARCHY]
        RH --> RL[ROLE_LEVELS]
        RH --> GRL[getRoleLevel]
        RH --> IVR[isValidRole]
        RH --> GIR[getInheritorRoles]
    end

    subgraph "Consumers"
        RS[RoleService] --> RH
    end

    classDiagram
        class RoleHierarchy {
            +ROLE_HIERARCHY: RoleHierarchy
            +ROLE_LEVELS: Record<string, number>
            +getRoleLevel(role: string): number
            +isValidRole(role: string): boolean
            +getInheritorRoles(targetRole: string): string[]
        }
```

## 3. Interface Documentation

- INT-001: Exports constants and functions for role management.

| Export | Purpose | Type | Usage Notes |
|--------|---------|------|-------------|
| `ROLE_HIERARCHY` | Role inheritance mappings | `RoleHierarchy` | Maps each role to array of inherited roles |
| `ROLE_LEVELS` | Privilege levels for comparison | `Record<string, number>` | Higher numbers = higher privilege |
| `getRoleLevel(role)` | Get privilege level | `(role: string) => number` | Returns 0 for unknown roles |
| `isValidRole(role)` | Validate role exists | `(role: string) => boolean` | Checks if role is defined in hierarchy |
| `getInheritorRoles(targetRole)` | Find roles that inherit access | `(targetRole: string) => string[]` | Returns sorted array of inheriting roles |

### Type Definitions

```ts
interface RoleHierarchy {
  [role: string]: string[];
}
```

## 4. Implementation Details

- IMP-001: `ROLE_HIERARCHY` defines inheritance where keys inherit from values in their arrays.
- IMP-002: Privilege levels range from 10 (public) to 100 (admin).
- IMP-003: Utility functions are pure and deterministic.
- IMP-004: `getInheritorRoles` iterates through hierarchy to find reverse inheritance.

Corner cases and considerations:

- Unknown roles return level 0 and are considered invalid.
- Inheritance is transitive through the hierarchy.
- Public role has no inherited roles (base level).

## 5. Usage Examples

### Checking role validity

```ts
import { isValidRole } from '@/src/mastra/config/role-hierarchy';

const valid = isValidRole('hr.admin'); // true
const invalid = isValidRole('unknown'); // false
```

### Getting privilege levels

```ts
import { getRoleLevel } from '@/src/mastra/config/role-hierarchy';

const adminLevel = getRoleLevel('admin'); // 100
const publicLevel = getRoleLevel('public'); // 10
```

### Finding inheritors

```ts
import { getInheritorRoles } from '@/src/mastra/config/role-hierarchy';

const inheritors = getInheritorRoles('employee');
// Returns: ['admin', 'hr.admin', 'finance.admin', 'engineering.admin', 'employee']
```

### Using hierarchy directly

```ts
import { ROLE_HIERARCHY } from '@/src/mastra/config/role-hierarchy';

const inherited = ROLE_HIERARCHY['hr.viewer'];
// Returns: ['employee', 'public']
```

## 6. Quality Attributes

- QUA-001 Security: Defines access hierarchy correctly; no circular dependencies.
- QUA-002 Performance: O(1) lookups for most operations; O(n) for inheritor search.
- QUA-003 Reliability: Pure functions with no external dependencies.
- QUA-004 Maintainability: Centralized configuration; easy to add new roles.
- QUA-005 Extensibility: Add roles by extending constants and updating levels.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - None

- REF-002: Configuration
  - Edit `ROLE_HIERARCHY` and `ROLE_LEVELS` to modify role structure.

- REF-003: Testing guidelines
  - Test inheritance chains and level ordering.
  - Validate all roles in hierarchy are consistent.

- REF-004: Troubleshooting
  - Issue: Unexpected access — verify hierarchy definitions.
  - Issue: Invalid role errors — check spelling against constants.

- REF-005: Related docs
  - `src/mastra/services/RoleService.ts` - Uses this configuration

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated