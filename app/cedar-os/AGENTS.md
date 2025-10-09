<!-- AGENTS-META {"title":"Cedar OS Integration","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app/cedar-os","tags":["layer:frontend","domain:ui","type:integration","status":"stable"],"status":"stable"} -->

# Cedar OS Integration (`/app/cedar-os`)

## Persona

**Name:** Interactive AI UI Orchestrator
**Role Objective:** Compose multi-mode chat UI and synchronize application state bi-directionally with the Cedar OS agent context.

## Directory Purpose

This directory contains the complete integration of the Cedar OS framework with the product roadmap application. It demonstrates how to connect a frontend React application's state to a backend AI agent, enabling conversational control over the UI. It manages the chat interface, state synchronization, and agent context.

## Scope

### In-Scope

- Configuring the main `<CedarCopilot>` provider to connect to the Mastra backend.
- Rendering the main UI, including the `RoadmapCanvas` and chat mode selectors.
- Registering application state (like roadmap nodes and edges) with Cedar OS so the agent can manipulate it.
- Subscribing to application state to expose it as context to the agent's prompts.
- Configuring `@` mentions to allow users to reference application state in the chat.

### Out-of-Scope

- The definition of the `RoadmapCanvas` component itself (which lives in `/cedar`).
- The backend Mastra agent and workflow logic.

## Key Files

| File          | Responsibility                    | Notes                                                                                                                                                                                   |
| ------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`  | Configures the Cedar OS Provider  | Wraps the route in `<CedarCopilot>` and configures it to connect to the Mastra backend at `http://localhost:4111`.                                                                      |
| `page.tsx`    | Renders the UI                    | A client component that renders the `RoadmapCanvas` and allows the user to switch between different chat modes.                                                                         |
| `hooks.ts`    | Orchestrates Cedar Hooks          | A simple facade that calls the other setup hooks (`useRoadmapState`, `useRoadmapMentions`, `useRoadmapContext`).                                                                        |
| `state.ts`    | State Registration & Manipulation | Uses `useRegisterState` to make the roadmap's `nodes` and `edges` state available to Cedar. Defines `stateSetters` (`addNode`, `removeNode`) that allow the agent to modify this state. |
| `context.ts`  | State Exposure to Agent           | Uses `useSubscribeStateToAgentContext` to feed the current `nodes` and `selectedNodes` into the agent's prompt context, allowing it to "see" the UI.                                    |
| `mentions.ts` | Configures `@` Mentions           | Uses `useStateBasedMentionProvider` to allow the user to reference roadmap nodes and edges in the chat with the `@` trigger.                                                            |

## Data Flow

1.  **Provider Setup:** `layout.tsx` wraps the entire page in `<CedarCopilot>`, establishing the connection to the Mastra backend.
2.  **UI Rendering:** `page.tsx` renders the `RoadmapCanvas` and the selected chat interface.
3.  **State Registration:** `state.ts` registers the `nodes` and `edges` from the canvas with Cedar OS and provides functions (`stateSetters`) for the agent to call to modify them.
4.  **Context Exposure:** `context.ts` subscribes to the `nodes` state and injects a simplified version of it into the context that is sent to the agent with every chat message.
5.  **User Interaction:** The user can interact with the UI directly or chat with the agent. They can use `@` mentions (configured in `mentions.ts`) to refer to specific nodes.
6.  **Agent Action:** The agent on the backend receives the user's message plus the context from `context.ts`. It can then decide to call one of the `stateSetters` defined in `state.ts` to modify the UI.

## Change Log

| Version | Date (UTC) | Change                                                                                                   |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Rewrote documentation to accurately reflect the specific roles of each file in the Cedar OS integration. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.                                                                      |
