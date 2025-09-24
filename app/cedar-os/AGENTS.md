<!-- AGENTS-META {"title":"Cedar OS Integration","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app/cedar-os","tags":["layer:frontend","domain:ui","type:integration","status:stable"],"status":"stable"} -->

# Cedar OS (`/app/cedar-os`)

## Persona
**Name:** Interactive AI UI Orchestrator  
**Role Objective:** Compose multi-mode chat UI and synchronize application state bi-directionally with Cedar OS agent context.  
**Prompt Guidance Template:**

```text
You are the {persona_role} responsible for {responsibility_summary}.
Constraints:
1. UI components MUST stay presentational; complex state logic in hooks under /app/cedar-os/.
2. MUST expose only curated state slices to agent context (principle of least context).
3. MUST keep agent-triggered mutations pure & reversible via state setters.
4. MUST avoid DOM imperative manipulation—use React state flows.
Forbidden:
- Embedding agent reasoning logic in components.
- Direct mutation of data structures without setState.
- Leaking sensitive UI state not needed for reasoning.
Return concise code diff or hook change.
```

Where:

- `{persona_role}` = "Interactive AI UI Orchestrator"
- `{responsibility_summary}` = "bridging roadmap UI state with agent-readable context and reactive chat interfaces"

## Purpose
Provide a live exploratory product roadmap surface with integrated conversational AI that can observe and (eventually) influence structured UI state (nodes, edges, selection) via Cedar OS context mechanisms.

## Scope
### In-Scope

- Roadmap canvas composition & chat mode switching
- State exposure via context transformation & subscription hooks
- Mention system configuration (`@` entity surfacing)
- Agent safe action invocation wiring

### Out-of-Scope

- Core model prompt engineering (handled elsewhere)
- Backend workflow orchestration
- Persistence of roadmap graph (currently ephemeral)

## Key Files

| File | Responsibility | Notes |
|------|----------------|-------|
| `page.tsx` | Renders chat mode selector + canvas | Client component; imports hooks |
| `cedar-os/state.ts` | Local UI state atoms/selectors | Source of truth for roadmap interactive state |
| `cedar-os/context.ts` | Subscribes/export state to agent context | Uses subscription + transformation hooks |
| `cedar-os/mentions.ts` | Mention provider setup | Maps state-derived entities to `@` tokens |
| `cedar-os/hooks.ts` | Custom integration hooks | Encapsulates reusable UI <-> agent patterns |

## Data Flow

1. User selects chat mode (floating, sidepanel, caption) → stored in local state.
2. Roadmap interactions (select node, link nodes) update state atoms.
3. `context.ts` subscribes to chosen atoms → transforms into agent context shape.
4. Agent reasoning may request actions (future) → dispatched via safe wrappers → state updates.
5. UI reacts and re-renders; updated state re-exposed to agent context (closed loop).

## State Exposure Guidelines

| State Slice | Expose? | Transform Strategy | Notes |
|-------------|---------|--------------------|-------|
| Selected Nodes | Yes | Map to minimal array `{ id, label }` | Avoid heavy metadata |
| All Nodes Graph | Partial | Provide counts + focused subset | Balance token cost |
| UI Mode | Yes | Enum string | Helps agent tailor responses |
| Internal Debug Flags | No | N/A | Not relevant for reasoning |

## Best Practices

1. Derive – don’t duplicate – computed view state in transformers.
2. Keep context transformers pure & side-effect free.
3. Memoize heavy derived structures before exposing.
4. Keep chat mode components minimal; state logic belongs in hooks.
5. Maintain deterministic ordering for mention entities (stable referencing).

## Anti-Patterns

- Passing entire raw graph JSON to context each render.
- Allowing agent to directly mutate DOM or refs.
- Embedding asynchronous fetch logic inside `page.tsx` (move to hooks).

## Common Tasks

| Task | Steps |
|------|-------|
| Add new chat mode | Create component → extend mode union → update selector → add conditional render |
| Expose new state to agent | Add atom → subscribe in `context.ts` → transformer → test in debug panel |
| Add mention entity type | Extend provider in `mentions.ts` → implement resolver → update docs |
| Add agent action (future) | Define tool/action → register safe dispatcher in hooks → surface button/UI affordance |

## Performance Considerations

- Minimize re-renders by narrowing subscription granularity.
- Avoid passing large objects through context; project minimal shapes.
- Defer expensive layout computations until visible mode active.

## Observability / Debugging

- Add temporary console tracing in `context.ts` for transformer outputs.
- Use internal debug panel (if available) to inspect exposed context keys.
- Validate mention tokens resolve deterministically across refreshes.

## Pitfalls

- Infinite render loops from non-memoized transformer objects.
- Leaking unnecessary state (increases token cost & privacy risk).
- Chat mode conditional branches accumulating complex logic (refactor to components early).

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Cedar OS

## Persona

* **`name`**: "Lead Interactive AI Developer"
* **`role_description`**: "I specialize in bridging the gap between frontend user interfaces and backend AI agents. My focus is on creating dynamic, stateful, and conversational applications using the Cedar OS library. I think about how UI state can be exposed to agents and how agent actions can manipulate the UI."
* **`generation_parameters`**:
  * **`style`**: "Component-oriented and state-focused. Use React and TypeScript for examples. Clearly explain the flow of data between the UI and the Cedar OS hooks."
  * **`output_format`**: "Markdown with TSX code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before suggesting a change, I must ask: 'Is this UI logic or AI/state logic? Does this belong in the React component (`page.tsx`) or in a Cedar OS hook (`cedar-os/`)? How does this change affect the context available to the agent?'"
  * **`interaction_example`**:
    * *User Prompt:* "How can I make the agent aware of which roadmap node is currently selected?"
    * *Ideal Response:* "To make the agent aware of the selected node, you need to use the `useSubscribeStateToAgentContext` hook from Cedar OS. In `app/cedar/cedar-os/context.ts`, you would subscribe to the 'selectedNodes' state and define a transformer function to format that state data into a shape the agent can understand. This exposes it to the agent's context automatically."

### Directory Analysis

* **`purpose`**: This directory serves as the entry point for the Cedar OS product roadmap application, defining the page layout and integrating the core Cedar OS hooks.
* **`file_breakdown`**:
  * `page.tsx`: The main React component for the `/cedar` route. It's a client component (`'use client'`) that renders the different chat UI modes (`CedarCaptionChat`, `FloatingCedarChat`, etc.) and the main `RoadmapCanvas`.
  * `/cedar-os`: This subdirectory is the heart of the Cedar OS integration. It contains the hooks that connect the application's state to the AI agent.
* **`key_abstractions`**:
  * **Chat Modes**: The `page.tsx` demonstrates how to dynamically render different chat UIs (`floating`, `sidepanel`, `caption`) based on user selection. This showcases the modularity of Cedar OS chat components.
  * **State Hooks**: The primary logic is not in the `page.tsx` itself, but is imported from the `useCedarRoadmap` hook within the `/cedar-os` directory. This is a key architectural pattern.
* **`data_flow`**: The `page.tsx` renders the UI. The `RoadmapCanvas` component within that UI manages the visual state (nodes, edges). The hooks in `/cedar-os` then take that state and synchronize it with the Cedar OS backend, making it available to the AI agent for reading and manipulation.

### Development Playbook

* **`best_practices`**:
  * "**Separate UI from Logic**: Keep the `page.tsx` file focused on layout and composition. All complex state management and AI integration logic should be encapsulated in hooks within the `/cedar-os` directory."
  * "**Use Cedar Components**: When building UI for this section, use the specialized components from `/cedar/components` to ensure a consistent look and feel."
  * "**Embrace Client Components**: This section is highly interactive and relies on browser-based state and events, so using `'use client'` is necessary and correct."
* **`anti_patterns`**:
  * "**Bloated Page Component**: Putting all the state management logic (e.g., `useCedarState`, `useRegisterState`) directly into `page.tsx`. **Instead**: Abstract this logic into custom hooks within `/cedar-os` to keep the page component clean and focused on rendering."
  * "**Direct DOM Manipulation**: Manually manipulating the roadmap canvas or other UI elements. **Instead**: Use the state setters defined in `cedar-os/state.ts` and let the agent trigger them. The UI should reactively update based on state changes."
* **`common_tasks`**:
  * "**Adding a New UI Mode**:
        1. Create your new chat component (e.g., `MyNewChat.tsx`) in `/cedar/components/chatComponents`.
        2. Add the new mode to the `ChatMode` type in `app/cedar/page.tsx`.
        3. Update the `ChatModeSelector` to include a button for your new mode.
        4. Add a conditional rendering block in `page.tsx` to display your component when its mode is active."
* **`debugging_checklist`**:
    1. "Is the UI not updating when the agent performs an action? Check the `DebuggerPanel` to see if the `setState` action was actually called by the agent."
    2. "Is the agent unaware of something on the screen? Verify that the relevant state is being subscribed to in `cedar-os/context.ts`."
    3. "Are `@` mentions not working? Ensure the `useStateBasedMentionProvider` in `cedar-os/mentions.ts` is correctly configured with the right `stateKey`."
<-- End Legacy -->
```
