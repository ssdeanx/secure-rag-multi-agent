<!-- AGENTS-META {"title":"Frontend Actions Layer","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/lib/actions","tags":["layer:frontend","domain:auth","type:actions","status:stable"],"status":"stable"} -->

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

| File      | Export                    | Purpose                                                    | Notes                                     |
| --------- | ------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
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

| roleId      | Roles Added                                  | stepUp | Description                        |
| ----------- | -------------------------------------------- | ------ | ---------------------------------- |
| finance     | finance.viewer                               | false  | Finance read-only demo user        |
| engineering | engineering.admin                            | false  | Engineering elevated demo user     |
| hr          | hr.admin                                     | true   | HR high-sensitivity demo (step-up) |
| executive   | finance.admin, engineering.viewer, hr.viewer | false  | Composite multi-department exec    |

## Change Log

| Version | Date (UTC) | Change                                          |
| ------- | ---------- | ----------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation added        |
