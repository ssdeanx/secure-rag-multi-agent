# Frontend and API Kilocode rule (frontend.md)

Scope
- Apply to Next.js app routes, API routes, and React components.
- Targets: [`app/layout.tsx`](app/layout.tsx:1), [`app/page.tsx`](app/page.tsx:1), [`app/api/chat/route.ts`](app/api/chat/route.ts:1), [`components/TopNavigation.tsx`](components/TopNavigation.tsx:1), [`components/docs/DocsLayout.tsx`](components/docs/DocsLayout.tsx:1)

Principles
- Client-side security: no secrets or sensitive data in client code.
- API security: proper JWT validation, input sanitization, and error handling.
- UI consistency: follow established component patterns and accessibility standards.
- Error boundaries: safe error handling without exposing internals.
- Performance: efficient rendering and data fetching.

Rules
1) Client-side security
- No secrets, API keys, or sensitive data in client components or pages.
- Use server components for sensitive operations; client components must be safe for public exposure.
- Checklist:
  - [ ] no secrets in client code
  - [ ] sensitive operations in server components

2) API route security
- All API routes must validate JWT tokens and check role/tenant claims.
- Input validation using zod schemas; sanitize all external inputs.
- Checklist:
  - [ ] JWT validation present
  - [ ] input validation with zod
  - [ ] role/tenant checks enforced

3) Error handling and logging
- API routes must return safe error messages without exposing stack traces or internals.
- Client components must handle errors gracefully with user-friendly messages.
- Checklist:
  - [ ] safe error responses in APIs
  - [ ] client error boundaries implemented
  - [ ] errors logged securely

4) Component patterns and accessibility
- Components must follow established patterns (e.g., Cedar UI components).
- Basic accessibility: alt text, keyboard navigation, semantic HTML.
- Checklist:
  - [ ] component patterns followed
  - [ ] accessibility attributes present
  - [ ] semantic HTML used

5) Data fetching and caching
- Use Next.js data fetching patterns; avoid client-side API calls for sensitive data.
- Implement proper loading states and error handling.
- Checklist:
  - [ ] server-side data fetching for sensitive data
  - [ ] loading states implemented
  - [ ] caching strategies appropriate

Reviewer checklist (PR)
- [ ] Client code free of secrets
- [ ] API routes validate JWT and inputs
- [ ] Error handling safe and user-friendly
- [ ] Components accessible and follow patterns
- [ ] Data fetching secure and efficient

Enforcement suggestions
- Add ESLint rules for client-side security checks (advisory).
- Provide API route template with validation boilerplate.

Next steps
- File written to .kilocode/rules/frontend.md as draft.