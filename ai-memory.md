
# AI Memory / Prompt library (short)

- Canonical files
  - Root layout: `app/layout.tsx`
  - Global styles: `app/globals.css`
  - Mastra client (auth): `lib/mastra/mastra-client.ts`
  - Mastra workflows: `src/mastra/`

- Dev commands
  - Start dev: `npm run dev` (launches Next + mastra dev)
  - Fast lint: `npm run lint:fast` (if available) or `npm run lint`
  - Fast tests: `npm run test:fast` (run a minimal vitest subset)

- Project conventions
  - Tailwind + shadcn primitives in `components/ui/` — do NOT modify unless explicitly requested by a human reviewer.
  - Centralized page container: `app/globals.css` uses `.app-container` — prefer this over ad-hoc inline styles.
  - Auth flows: use server-side proxy routes under `app/api/auth/` and set HttpOnly cookies for tokens.

- Do-not-edit (unless approved)
  - `components/ui/**` (shadcn)
  - `package.json` scripts and `next.config.mjs` unless change is small and tested
  - `src/mastra/**` (mastra workflows) — changes here can affect running agents; consult Sam

- Security rules
  - Never commit secrets; do not add any env vars with `NEXT_PUBLIC_` for secrets.
  - If a migration or infra change is needed, create an issue and request human approval.

- Style preferences
  - Use Tailwind utility classes and shared utilities in `app/globals.css`.
  - Use braces on single-line `if` statements to satisfy ESLint rules.

- Typical reviewers
  - Primary maintainer: sam (handle: sam)
