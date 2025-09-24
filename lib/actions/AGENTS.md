<!-- AGENTS-META {"title":"Frontend Actions Layer","version":"1.0.0","last_updated":"2025-09-24T12:47:00Z","applies_to":"/lib/actions","tags":["layer:frontend","domain:auth","type:actions","status:stable"],"status":"stable"} -->

# Actions Directory (`/lib/actions`)

## Persona
**Name:** `{actions_persona_name}` = "Secure Action Author"  
**Role:** "I create minimal, auditable server actions that bridge UI intents to authorized backend capabilities without leaking secrets or duplicating business logic."  
**Mission:** Provide a thin, clear surface for privileged operations (e.g., JWT issuance) while enforcing strict validation & role alignment.

**MUST:**

- Prefix file with `'use server'` to ensure correct compilation context.  
- Keep each action focused (single responsibility).  
- Validate inputs & constrain accepted role identifiers.  
- Return only the data the UI actually needs (principle of least privilege).  
- Throw explicit errors for invalid role IDs.

**FORBIDDEN:**

- Embedding policy logic duplicated from backend.  
- Returning raw secrets or signing keys.  
- Overloading a single action with unrelated ops.  
- Silent failure (must throw for invalid cases).

## Purpose
Houses frontend-triggered server actions (Next.js / React Server Components) enabling secure generation or transformation steps that must execute server-side but remain UI-invocable.

## Current Actions

| File | Export | Purpose | Notes |
|------|--------|---------|-------|
| `auth.ts` | `generateDemoJWT(roleId)` | Issues short-lived demo JWT for a predefined role template | Uses JOSE `SignJWT`, controlled claim set |

### `generateDemoJWT(roleId: string)`
Generates a demo token with layered roles. Adds a base `employee` role plus role-template specific entries. Includes `stepUp` for higher sensitivity roles.

Claims issued:

```json
{
  "sub": "demo-user-<roleId>@example.com",
  "roles": ["employee", "<role-specific-roles>"],
  "tenant": "acme",
  "stepUp": <boolean>
}
```


Expiration: `2h` (hard-coded).  
Algorithm: `HS256`.  
Secret Source: `process.env.JWT_SECRET` fallback `'dev-secret'` in local dev only.

## Role Templates

| roleId | Roles Added | stepUp | Description |
|--------|-------------|--------|-------------|
| finance | finance.viewer | false | Finance read-only demo user |
| engineering | engineering.admin | false | Engineering elevated demo user |
| hr | hr.admin | true | HR high-sensitivity demo (step-up) |
| executive | finance.admin, engineering.viewer, hr.viewer | false | Composite multi-department exec |

## Usage Example

```ts
'use client';
import { useState } from 'react';

export function DemoTokenButton() {
  const [token, setToken] = useState<string>('');
  async function issue() {
    const res = await (await fetch('/api/demo-token?role=finance')).json();
    setToken(res.token);
  }
  return <button onClick={issue}>Get Finance Token</button>;
}
```
(Above is an example pattern; actual integration might call the action directly in RSC context.)

## Best Practices

| Area | Guideline |
|------|-----------|
| Naming | Use verb-first (e.g., `generateDemoJWT`) |
| Security | Fail fast on unknown `roleId` values |
| Simplicity | Keep actions thin; delegate complexity to services/workflows |
| Consistency | Return predictable shapes for UI consumption |
| Error Messaging | Provide deterministic error strings for UI branching |

## Anti-Patterns

| Pattern | Issue | Resolution |
|---------|-------|-----------|
| Broad action doing many unrelated tasks | Harder to audit | Split into focused actions |
| Embedding business policy | Duplication / drift risk | Call backend or central service |
| Returning entire JWT decode | Overexposure | Return only signed token string |
| Accepting arbitrary role strings | Escalation risk | Constrain to static map |

## Hardening Checklist

- [ ] Input parameter union-typed or validated.  
- [ ] Explicit error for invalid role.  
- [ ] Short expiration (< 4h) enforced.  
- [ ] Roles list conforms to policy taxonomy.  
- [ ] No secret leakage (only signed token returned).  
- [ ] Uses stable signing algorithm (`HS256`) unless rotated intentionally.

## Future Enhancements

- Add runtime Zod schema for `roleId`.  
- Centralize role templates in shared policy module.  
- Add telemetry event on token generation.  
- Integrate optional step-up challenge simulation flow.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Initial standardized documentation added |

## Legacy Content
No prior file existed; nothing to preserve.
