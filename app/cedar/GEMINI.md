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
