<!-- AGENTS-META {"title":"Auth API Routes","version":"1.0.1","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app/api/auth","tags":["layer:backend","domain:auth","type:api","status:beta"],"status":"beta"} -->

# Auth API Routes (`/app/api/auth`)

## Persona
**Name:** Auth API Specialist  
**Objective:** Provide minimal, secure endpoints for authentication lifecycle (signup, login, signout) and role token provisioning for demos.  
**Prompt Template:**

```text
You are the {persona_name} ensuring authentication endpoints remain minimal, secure, and stateless.
Inputs: HTTP request with JSON body or form data.
Outputs: JSON response with sanitized fields (never raw secrets).
Constraints:
1. Never log full JWT or sensitive credentials.
2. Always validate required fields (email, password, role).
3. Return consistent error shape: { "error": string }.
Forbidden:
- Embedding business logic in route (delegate to services or utilities).
- Returning unhashed secrets or internal stack traces.
```

Variables:

- `{persona_name}` = "Auth API Specialist"

## Directory Purpose
Implements authentication lifecycle endpoints used in demos or future expansion: login, signup, signout. Serves as a boundary layer—NOT a full auth provider.

## Scope

### In-Scope

- Credential payload validation
- Session/JWT issuance via helper utilities (demo roles)
- Idempotent signout mechanics (client-directed)

### Out-of-Scope

- Password storage or hashing (would require secure store)
- Multi-factor auth, OAuth, SSO integrations
- Persistent user database (beyond demo context)

## Key Endpoints

| Route | Method | Purpose | Notes |
|-------|--------|---------|-------|
| `/api/auth/login` | POST | Issue demo JWT / session | Validates credentials (mock) |
| `/api/auth/signup` | POST | Provision demo account stub | Placeholder for extensibility |
| `/api/auth/signout` | POST | Clear client session hints | Stateless token discard |

## Responsibilities

- Normalize auth request/response shapes
- Enforce input presence and format
- Delegate token creation to shared utilities (no inline signing logic)

## Non-Responsibilities

- Durable user identity storage
- Password hashing / credential security (demo only)
- Role expansion logic (handled by policy/agents)

## Validation Checklist

| Field | Requirement | Failure Code |
|-------|-------------|--------------|
| `email` | Must be present & valid format | 400 |
| `password` | Present (no strength check in demo) | 400 |
| `role` | Matches allowed demo roles | 400 |

## Error Handling Pattern

```jsonc
{ "error": "invalid_credentials" }
```

HTTP Codes:

- 200 Success
- 400 Validation / unsupported role
- 401 Future: invalid credentials (if real auth added)
- 500 Internal unexpected error

## Security Notes

- Do NOT store plaintext secrets
- Avoid leaking timing differences (constant response shape/time if feasible)
- Never echo back password or secret claims

## Common Tasks

1. Add New Auth Endpoint
   - Create folder `app/api/auth/<action>/route.ts`
   - Implement `POST` with validation & response shape
2. Introduce Real Auth (future)
   - Add persistent user store (external DB)
   - Hash passwords (bcrypt/argon2) in service layer
   - Replace demo JWT issuance with secure signing pipeline
3. Enforce Allowed Roles
   - Centralize role enumeration in a const shared module
   - Validate `role` against enum before token creation

## Performance Considerations

- Endpoints are lightweight; prioritize response consistency over micro-optimizations
- Rate limiting may be added at an edge layer in future

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.1 | 2025-09-24 | Lint formatting fixes (lists, code fences, tables) |
| 1.0.0 | 2025-09-24 | Initial standardized auth API documentation |
