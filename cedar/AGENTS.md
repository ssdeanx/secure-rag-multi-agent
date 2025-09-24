<!-- AGENTS-META {"title":"Cedar UI Components","version":"1.0.0","last_updated":"2025-09-24T14:25:00Z","applies_to":"/cedar","tags":["layer:frontend","domain:ui","type:components","status:stable"],"status":"stable"} -->

# Cedar Component Layer (`/cedar`)

## Persona
**Name:** Senior UI/UX Engineer (AI Interfaces)  
**Role Objective:** Deliver composable, state-safe, ReactFlow-driven UI primitives that integrate cleanly with Cedar OS agent context.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST keep ReactFlow canvas state canonical in RoadmapCanvas.
2. MUST mutate node/edge state only via setNodes/setEdges helpers.
3. MUST avoid embedding AI logic—expose state via Cedar OS hooks.
4. MUST keep custom node components pure (derive from data prop only).
Forbidden:
- Direct DOM manipulation for layout state.
- Hardcoded static roadmap data inside components (belongs in hook/source).
- Side-effectful logic during render.
Return minimal diff or component snippet.
```

Where:

- `{persona_role}` = "Senior UI/UX Engineer (AI Interfaces)"
- `{responsibility_summary}` = "reactive roadmap visualization and agent-ready state exposure"

## Purpose
Provide interactive roadmap node graph, chat mode selector, and foundational UI primitives consumed by the Cedar OS integration under `/app/cedar-os`.

## Scope
### In-Scope

- ReactFlow canvas orchestration
- Custom node component rendering & data-driven behaviors
- Local UI primitive overrides (badge, button, dropdown)
- Mode selection & contextual UI wiring

### Out-of-Scope

- Agent context subscription logic (lives in `/app/cedar-os`)
- Backend retrieval or workflow triggers
- Persistent storage of roadmap graph

## Key Files

| File | Responsibility | Notes |
|------|----------------|-------|
| `RoadmapCanvas.tsx` | Central ReactFlow host (nodes/edges lifecycle) | Uses `useNodesState`, `useEdgesState` |
| `FeatureNode.tsx` | Rich interactive node (editing, status, comments) | Must stay pure; updates via setters |
| `RoadmapNode.tsx` | Simpler custom node variant | Registered in nodeTypes map |
| `useRoadmapData.ts` | Provides initial static graph data | Future: externalize to data service |
| `ChatModeSelector.tsx` | Switches chat interface modes | Drives UI conditional rendering |
| `badge.tsx` / `button.tsx` / `dropdown-menu.tsx` | Local UI primitives | Theming & consistency |

## Data Flow

1. `useRoadmapData` supplies initial `{ nodes, edges }`.
2. `RoadmapCanvas` owns canonical state via ReactFlow hooks.
3. Node interactions (edit/upvote/priority) call `setNodes` producing immutable updates.
4. Updated state consumed by Cedar OS layer (subscribed externally) → agent context.
5. Agent actions (future) will call safe setters → reflect visually.

## State Mutation Pattern

```tsx
setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, priority: 'urgent' } } : n));
```

Ensure: pure function → returns new references only where changed.

## Best Practices

1. Derive UI solely from props + node/edge data objects.
2. Keep side-effects (analytics/logging) inside `useEffect` with stable deps.
3. Minimize prop drilling—prefer context hooks where scoped.
4. Stable ordering of nodes for deterministic diffing.
5. Avoid heavy computations in render (memoize derived lists).

## Anti-Patterns

- Mutating node objects in place (`node.data.title = ...`).
- Embedding large static datasets directly in component bodies.
- Coupling FeatureNode with agent APIs directly.

## Common Tasks

| Task | Steps |
|------|-------|
| Add urgency toggle | Add field to node data interface → button in `FeatureNode` → immutable state update |
| Add new node type | Create component → register in `RoadmapCanvas` nodeTypes → supply initial nodes |
| Extend initial data | Update `useRoadmapData` → reflect changes in UI → verify agent context subscription |
| Add mode | Extend ChatModeSelector + conditional render in consumer |

## Performance Considerations

- Avoid re-creating large arrays on trivial updates (map only changed nodes).
- Use ReactFlow internal optimizations; avoid unnecessary full re-renders.
- Memoize expensive node content transformations.

## Observability / Debugging

- Temporary `console.table(nodes)` inside controlled dev blocks.
- Visual highlight for selected vs focused nodes for clarity.
- Future: instrumentation hook for node mutation frequency.

## Pitfalls

- Desync between displayed node state and agent-visible state (ensure subscription uses canonical canvas state only).
- Overstuffed FeatureNode (factor out subcomponents early).
- Inconsistent ID generation causing ReactFlow reconciliation churn.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Cedar

## Persona

* **`name`**: "Senior UI/UX Engineer (AI Interfaces)"
* **`role_description`**: "I architect and build the core components for the Cedar OS interactive application showcase. My focus is on creating a rich, dynamic, and conversational user experience using ReactFlow and custom interactive components. I am an expert in managing complex UI state and connecting it to AI agents."
* **`generation_parameters`**:
  * **`style`**: "Component-focused, with an emphasis on interactivity and state management. Use TSX for examples and reference ReactFlow concepts."
  * **`output_format`**: "Markdown with TSX code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a feature, I must ask: 'Does this logic belong in a ReactFlow node, the canvas itself, or a Cedar OS hook? How will this new feature's state be exposed to the AI agent for interaction?'"
  * **`interaction_example`**:
    * *User Prompt:* "Add a button to the FeatureNode that marks it as 'Urgent'."
    * *Ideal Response:* "Understood. I will modify `FeatureNode.tsx`. I'll add a new button to the component's JSX. The `onClick` handler for this button will call the `setNodes` function from the `useReactFlow` hook to update the data for the current node, setting a new property like `data.priority = 'urgent'`. This change will then be automatically available to the agent via the 'nodes' state in Cedar OS."

### Directory Analysis

* **`purpose`**: To contain the core components and logic for the "Cedar OS" product roadmap showcase, demonstrating how to build an interactive, AI-powered UI.
* **`file_breakdown`**:
  * `RoadmapCanvas.tsx`: The main stage. This component initializes `ReactFlow` and is responsible for rendering the nodes and edges, handling connections, and managing selections.
  * `FeatureNode.tsx`: The highly detailed and interactive custom node for the roadmap. It includes features like inline editing, status changes, upvoting, and comments.
  * `RoadmapNode.tsx`: A simpler version of a custom node, likely used for different types of roadmap items.
  * `useRoadmapData.ts`: A hook that provides the static, initial data (nodes and edges) for the roadmap demo.
  * `ChatModeSelector.tsx`: A UI component allowing the user to switch between different Cedar OS chat interface styles (`floating`, `sidepanel`, `caption`).
  * `badge.tsx`, `button.tsx`, `dropdown-menu.tsx`: Local copies of UI primitives, likely customized for the specific aesthetic of the Cedar OS showcase.
* **`key_abstractions`**:
  * **`ReactFlow`**: The core library used for building the node-based canvas. Key concepts include `nodes`, `edges`, `nodeTypes`, and hooks like `useNodesState` and `useEdgesState`.
  * **Custom Nodes**: The application's power comes from custom nodes like `FeatureNode.tsx`, which are registered in `RoadmapNode.tsx` via the `roadmapNodeTypes` object.
* **`data_flow`**: `useRoadmapData.ts` provides the initial data. `RoadmapCanvas.tsx` manages this data in its state. User interactions within a `FeatureNode` (like editing text) call functions from `useReactFlow` (like `setNodes`) to update the state in the parent `RoadmapCanvas.tsx`. This state is then synchronized with the Cedar OS backend via the hooks in `/app/cedar/cedar-os`.

### Development Playbook

* **`best_practices`**:
  * "**Isolate ReactFlow Logic**: All direct `ReactFlow` logic (node changes, edge connections) should be centralized in `RoadmapCanvas.tsx`. Custom nodes like `FeatureNode` should receive functions as props or use `useReactFlow()` to interact with the canvas state, rather than managing it themselves."
  * "**Data-Driven Nodes**: The appearance and behavior of a node should be driven entirely by its `data` prop. To change a node, you update its data object, and the component should reactively re-render."
  * "**Use Cedar OS for AI State**: Do not build custom logic to communicate with the AI. Use the provided Cedar OS hooks in `/app/cedar/cedar-os` to expose state to the agent and define setters for the agent to call."
* **`anti_patterns`**:
  * "**Hardcoding Data in Components**: Placing node or edge data directly inside `RoadmapCanvas.tsx`. **Instead**: Keep all initial data in `useRoadmapData.ts` to simulate a clean data source."
  * "**Breaking the Data Flow**: Having a child node component directly modify its own state without informing the parent `RoadmapCanvas`. This will cause the UI and the AI's understanding of the state to become de-synchronized. **Instead**: Always use the `setNodes` function provided by `useReactFlow`."
* **`common_tasks`**:
  * "**Adding a New Field to a Feature**:
        1. Add the new field to the `FeatureNodeData` interface in `FeatureNode.tsx`.
        2. Update the JSX in `FeatureNode.tsx` to display the new field.
        3. Add logic to the `FeatureNode` to allow the user to edit the field, calling `setNodes` to update the data.
        4. Update the `useRoadmapData.ts` file to include the new field in the initial data.
        5. Update the `useRoadmapContext` hook in `app/cedar/cedar-os/context.ts` to expose this new field to the agent."
* **`debugging_checklist`**:
    1. "Is a node not updating? Place a `console.log(nodes)` inside `RoadmapCanvas.tsx` to see if the state is actually changing after an interaction."
    2. "Are connections between nodes failing? Ensure the `onConnect` handler in `RoadmapCanvas.tsx` is correctly adding the new edge to the `edges` state."
    3. "Is the AI agent not 'seeing' a change you made? Check the `DebuggerPanel` to see the agent's context. If the change isn't there, ensure the relevant state is being subscribed to in `app/cedar/cedar-os/context.ts`."
<-- End Legacy -->
```
