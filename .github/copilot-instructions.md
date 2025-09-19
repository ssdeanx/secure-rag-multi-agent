
# Repository-specific Copilot instructions

This repository uses Next.js (app router), TypeScript, Tailwind CSS, and shadcn/ui primitives. It also includes Mastra workflows under src/mastra and a Mastra backend used for authentication and agent orchestration.

Purpose

- Help automated coding agents make safe, high-value changes. Keep this file short — 20–50 lines.

Quick rules

- Read these files first: README.md, package.json, app/layout.tsx, app/globals.css, lib/mastra/mastra-client.ts, src/mastra/.
- Do NOT modify files under components/ui/ (shadcn primitives) unless the change is explicitly requested by a human reviewer.
- Keep server-only secrets in environment variables that do NOT start with NEXT_PUBLIC_. Do not expose secrets in client bundles.
- For auth changes, use lib/mastra/mastra-client.ts as the canonical Mastra client surface. If you need a helper factory, add or merge it into that file.
- Prefer server routes (app/api) to interact with the Mastra backend and set HttpOnly cookies for user tokens. Avoid storing sensitive tokens in localStorage for production.

Dev commands

- Start local development: npm run dev (this launches Next and mastra dev concurrently).
- Run only fast unit tests during automated edits. Ask before running long builds or environment creation.

Style and lint

- Follow existing TypeScript strictness and lint rules. Use braces on all conditional blocks to satisfy the repo's ESLint rules.
- Prefer Tailwind classes and shared utilities in app/globals.css for styling. Remove inline style="..." only where it will not break library components.

When touching auth

- Add server-side API routes that proxy to MASTRA_BASE_URL and set secure cookies when tokens are returned.
- Do not hard-code tokens; read MASTRA_BASE_URL and JWT_TOKEN from server env.

If unsure

- Leave a TODO comment and add a brief PR note explaining the change and the reason. Ask a human for confirmation for risky or large changes.

Contact

- Reviewer: sam (primary maintainer). Include a short summary and list of files changed in each PR.

Advanced tips

- Limit agent internal edit cycles to 10. After 10 internal iterations the agent must pause and request a human review.
- Require git pull/rebase before starting any automated editing session. Agents must run `git status` and present `git diff` prior to committing.
- Run linting and fast unit tests (eslint, TypeScript, and quick vitest subset) after any AI-generated edits and before commit. Do not merge if any check fails.
- Do not auto-approve commands that change secrets, infrastructure, or dependencies. Only allow a small whitelist of safe commands if explicitly configured in the developer's workspace settings.
- Explicitly do not edit: `components/ui/**` (shadcn primitives) and `app/globals.css` only via agreed changes. Use `lib/mastra/mastra-client.ts` as the canonical Mastra auth surface.

Agent workflow (short checklist)

1. Pull latest main + rebase onto branch.
2. Run `npm run lint` and `npm run test:fast` locally.
3. Start agent session; instruct it to obey `copilot-instructions.md` and `ai-memory.md`.
4. After edits, run `git status` and `git diff` and present the changes.
5. Run lint/tests; if failures occur, iterate up to 3 times then request human review.
6. Open PR with a short description and the model name/version used.

