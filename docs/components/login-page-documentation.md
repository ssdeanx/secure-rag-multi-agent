---
title: LoginPage - Technical Documentation
component_path: `app/login/page.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Authentication / Frontend
tags: [page, login, auth, react, nextjs]
---

# LoginPage Documentation

Client-side login/signup page for the application, handling form submission to /api/auth endpoints, token storage, and custom auth events. Supports role selection and mode toggle (login/signup).

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide user authentication interface with email/password and role selection.

- OVR-002: Scope: Form handling, API calls, localStorage for token/email/role, custom event dispatch. Excludes backend auth logic.

- OVR-003: Context: Mounted at /login; used for initial access before protected routes.

## 2. Architecture Section

- ARC-001: Design patterns: Controlled form component with async submission.

- ARC-002: Dependencies:
    - React (useState for form/error/loading)

    - Next.js (fetch for API)

    - shadcn/ui (Button)

    - Local: extractToken util

- ARC-003: Interactions: Submits to /api/auth/login or /signup; stores token; dispatches 'auth:login' event.

- ARC-004: Decisions: Dual mode (login/signup); role dropdown; error display.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Login Page"
        L[LoginPage] --> F[Form: email, password, role]
        L --> M[Mode Toggle]
    end

    subgraph "Submission"
        F --> Sub[handleAuth]
        Sub --> API[/api/auth/login|signup]
        API --> T[extractToken]
        T --> LS[localStorage: jwt, email, role]
        Sub --> Ev[CustomEvent 'auth:login']
    end

    subgraph "External"
        N[Next.js] --> Sub
        UI[shadcn/ui] --> F
    end

    classDiagram
        class LoginPage {
            +email, password, role, mode: state
            +handleAuth(e): async void
            +extractToken(data): string|null
        }
        class AuthBody {
            +email: string
            +password: string
            +role?: string
        }

        LoginPage --> AuthBody
```

## 3. Interface Documentation

- INT-001: Page component; no props.

| Function     | Purpose            | Parameters        | Return Type     | Usage Notes                            |
| ------------ | ------------------ | ----------------- | --------------- | -------------------------------------- |
| `handleAuth` | Submit form to API | `React.FormEvent` | `Promise<void>` | Prevents default; handles login/signup |

### Internal Types

```tsx
interface AuthBody {
    email: string
    password: string
    role?: string
}
```

INT notes:

- INT-003: Dispatches CustomEvent for app-wide auth reaction.

## 4. Implementation Details

- IMP-001: useState for form fields, mode, loading, error.

- IMP-002: handleAuth: Fetch to endpoint; extractToken searches response for token; store in localStorage; dispatch event.

- IMP-003: extractToken: Checks multiple paths (token, accessToken, data.token).

- IMP-004: UI: Form with inputs, select, buttons; error alert.

Edge cases and considerations:

- No token: Still stores email/role for non-token flows.

- API error: Displays message from response.

## 5. Usage Examples

### Basic Usage (Next.js page)

```tsx
// app/login/page.tsx
import LoginPage from './LoginPage' // This is the component

export default function Login() {
    return <LoginPage />
}
```

### Event Listening (in app)

```tsx
useEffect(() => {
    const handleAuth = (e) => {
        console.log('Logged in:', e.detail)
        // Redirect or update UI
    }
    window.addEventListener('auth:login', handleAuth)
    return () => window.removeEventListener('auth:login', handleAuth)
}, [])
```

Best practices:

- Use CustomEvent for loose coupling.

- Validate form client-side before submit.

## 6. Quality Attributes

- QUA-001 Security: Client-side; passwords in state (clear on unmount). Use HTTPS for API.

- QUA-002 Performance: Simple form; async fetch non-blocking.

- QUA-003 Reliability: Error handling for fetch/JSON; fallbacks in extractToken.

- QUA-004 Maintainability: Small, focused; utils extractable.

- QUA-005 Extensibility: Add fields (e.g., tenant) to AuthBody.

## 7. Reference Information

- REF-001: Dependencies: react (^18), next (^14), shadcn/ui

- REF-002: Configuration: Endpoints /api/auth/login|signup.

- REF-003: Testing: Mock fetch; test token extraction, event dispatch.

- REF-004: Troubleshooting: No token — check response structure.

- REF-005: Related: /api/auth/\* endpoints

- REF-006: Change history: 1.0 (2025-09-23)
