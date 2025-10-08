<!-- AGENTS-META {"title":"Auth API Routes","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app/api/auth","tags":["layer:backend","domain:auth","type:api","status":"beta"],"status":"beta"} -->

# Auth API Routes (`/app/api/auth`)

## Persona

**Name:** Auth API Specialist
**Objective:** Provide minimal, secure endpoints for the authentication lifecycle (signup, login, signout) that proxy to a backend auth service.

## Directory Purpose

Implements the authentication lifecycle endpoints for the application. These routes act as a secure backend-for-frontend (BFF) layer, proxying requests to the core Mastra authentication service and managing session cookies.

## Scope

### In-Scope

- Proxying credential payloads to the Mastra backend.
- Setting secure, HttpOnly session cookies upon successful login/signup.
- Providing a stateless signout endpoint.

### Out-of-Scope

- Directly handling password storage or hashing.
- Implementing multi-factor auth, OAuth, or SSO integrations.
- Managing user data beyond the proxying of requests.

## Key Endpoints

| Route               | Method | Purpose                            | Notes                                                                          |
| ------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------ |
| `/api/auth/login`   | POST   | Issues a session token via cookie. | Proxies credentials to the Mastra backend and sets an HttpOnly session cookie. |
| `/api/auth/signup`  | POST   | Provisions a new account.          | Proxies signup data to the Mastra backend and sets an HttpOnly session cookie. |
| `/api/auth/signout` | POST   | Clears client session hints.       | Responds with success; client is expected to clear any local session state.    |

## Responsibilities

- Normalize auth request/response shapes between the client and the Mastra backend.
- Securely handle session tokens using HttpOnly cookies.
- Delegate all authentication and user management logic to the Mastra service.

## Change Log

| Version | Date (UTC) | Change                                                      |
| ------- | ---------- | ----------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Synchronized content with source code and updated metadata. |
| 1.0.1   | 2025-09-24 | Lint formatting fixes.                                      |
| 1.0.0   | 2025-09-24 | Initial standardized auth API documentation.                |
