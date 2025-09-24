
# AI Memory / Prompt library (short)

- Canonical files
  - Root layout: `app/layout.tsx`
  - Global styles: `app/global.css`
  - Mastra client (auth): `lib/mastra/mastra-client.ts`
  - Mastra workflows: `src/mastra/`

- Dev commands
  - Start dev: `npm run dev` (launches Next + mastra dev)
  - Fast lint: `npm run lint:fast` (if available) or `npm run lint`

- Project conventions
  - Tailwind + shadcn primitives in `components/ui/` — do NOT modify unless explicitly requested by a human reviewer.
  - Centralized page container: `app/global.css` which has to force the `text-center` class, but because if not its starting with `text-left: start` and that breaks the layout forcing left-alignment on all text & components.
  - Auth flows: use server-side proxy routes under `app/api/auth/` and set HttpOnly cookies for JWTs.
  - API routes: use `app/api/` for Next.js API routes.
  - Data fetching: use `lib/data/` for all data fetching logic.
  - UI components: use `components/` for all landing UI components.
  - UI for mastra - cedar: use `cedar/` for all mastra-related UI Custom components.
  - Custom hooks: use `hooks/` for all custom hooks.
  - Utilities: use `utils/` and `lib/utils/` for all general utility functions.
  - Mastra workflows: use `src/mastra/services/` for helper functions and `src/mastra/workflows/` for orchestrating agents. Do not call mastra client directly from route handlers.

- Cedar / Mastra tools (AI functions)
  - Cedar components: use `cedar/components/` for all cedar-related UI components.
    for primitives, use `cedar/components/ui/` (shadcn+custom components).
    These components are built with with specific props to work with mastra workflows.
  - Cedar pages: use `cedar/(pages)/` for all cedar-related pages.
  - Cedar layouts: use `cedar/(layouts)/` for all cedar-related layouts.
  - Cedar hooks: use `cedar/hooks/` for all cedar-related hooks.
  - Cedar utils: use `cedar/utils/` for all cedar-related utils.

- Your MCP tools available to help use
  - checkInstall: ALWAYS CALL FIRST at conversation start! Verifies Cedar installation. IMPORTANT: After Cedar is confirmed, ALL components are in src  TooltipMenu.tsx EXISTS in inputs/, FloatingCedarChat.tsx EXISTS in chatComponents/. NEVER create spell components - use the existing ones!

  - getRelevantFeature: Identify relevant Cedar-OS feature(s) for a described goal
    - Parameters
      - goal*
              What the user wants to achieve
      - context
              Optional project/context details
  - clarifyRequirements: Suggest clarifying questions to better understand requirements
    - Parameters
      - goal*
              No description
      - known_constraints
              No description
  - confirmRequirements: Confirm that required Cedar setup requirements are satisfied
    - Parameters
      - confirmations
              Map of checklist item id to confirmation boolean
      - checkInstall

  - searchDocs: [MANDATORY FIRST STEP] YOU MUST USE THIS BEFORE ANSWERING ANY CEDAR/MASTRA QUESTION! Search documentation to prevent hallucination. Use for ALL Cedar topics: components, voice, chat, spells, Mastra backend. ALWAYS call FIRST before providing any Cedar/Mastra information.
    - Parameters:
      - `query` (string, required) - Implementation query like: 'ChatInput implementation', 'floating chat code', 'VoiceButton props', 'useCedarStore example', 'import statements for [component]'
      - `limit` (number, optional) - The maximum number of search results to return. Defaults to 5.
      - `use_semantic` (boolean, optional) - Use semantic search for better context understanding.
      - `doc_type` (string, optional) - Documentation type (auto-detects based on query).

  - mastraSpecialist: [MASTRA EXPERT - MANDATORY] YOU MUST USE THIS TOOL BEFORE ANSWERING ANY MASTRA QUESTIONS! I search Mastra docs for accurate backend information (agents, workflows, tools, memory). ALWAYS call me FIRST for Mastra topics to prevent hallucination.
    - Parameters
      - query*
              Search query for Mastra concepts
      - limit
              No description

  - spellsSpecialist: [SPELLS EXPERT - MANDATORY] YOU MUST USE THIS TOOL BEFORE ANSWERING ANY   SPELLS QUESTIONS! I search Cedar docs for accurate Spells information (AI interactions, radial menus, gestures, hotkeys). ALWAYS call me FIRST for Spells/RadialMenu/useSpell/QuestioningSpell/TooltipMenu/Hotkey/SpellSlice/SpellActivationManager topics to prevent hallucination.
    - Parameters
      - action*
              Action: search docs, get implementation guide, troubleshoot issue, or explore spell features
      - query*
              Your specific question or search query about spells
      - focus
              Area to focus the search on

  - contextSpecialist: [CONTEXT EXPERT - MANDATORY] YOU MUST USE THIS TOOL BEFORE ANSWERING ANY AGENT INPUT CONTEXT QUESTIONS! I search Cedar docs for accurate Agent Input Context information (mentions, state subscription, context transformation). ALWAYS call me FIRST for context topics to prevent hallucination.
    - Parameters
      - action*
              Action: search docs, get implementation guide, troubleshoot issue, or explore context features
      - query*
              Your specific question or search query about Agent Input Context
      - focus
              Area to focus the search on

  - voiceSpecialist: [VOICE EXPERT - MANDATORY] YOU MUST USE THIS TOOL BEFORE ANSWERING ANY VOICE QUESTIONS! I search Cedar docs for accurate Voice information (audio, microphone, transcription). ALWAYS call me FIRST for voice/audio/VoiceIndicator topics to prevent hallucination.

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

- Cedar docs for mastra integration:
  - [https://docs.cedarcopilot.com/agent-backend-connection/mastra/](https://docs.cedarcopilot.com/agent-backend-connection/mastra/)
  - [https://docs.cedarcopilot.com/agent-backend-connection/custom](https://docs.cedarcopilot.com/agent-backend-connection/custom)
  - [https://docs.cedarcopilot.com/type-safety/typing-agent-requests](https://docs.cedarcopilot.com/type-safety/typing-agent-requests)
  - [https://docs.cedarcopilot.com/](https://docs.cedarcopilot.com/)
