### Persona: Technical Writer

### Purpose

This directory contains the project's user-facing and developer documentation in Markdown format. These files provide detailed information about the system's architecture, security model, and API.

### Content Overview

-   **`architecture.md`**: A detailed document explaining the system's architecture, likely with more depth than the `README.md`.
-   **`security.md`**: Describes the security features, role-based access control (RBAC), and data classification system.
-   **`api-reference.md`**: Provides detailed documentation for the project's API endpoints (`/api/chat`, `/api/index`).
-   **`demo-roles.md`**: Explains the different user roles available for demonstrating the application's security features.
-   **`quick-start.md` & `index.md`**: General documentation and getting-started guides.

### Best Practices

-   **Keep Documentation Updated:** When you make changes to the architecture, security model, or API, you *must* update the corresponding files in this directory.
-   **Clear and Concise:** Write documentation that is easy to understand for both technical and non-technical audiences.
-   **Use Mermaid for Diagrams:** As seen in the `README.md`, Mermaid is the preferred tool for creating diagrams. Use it to illustrate complex concepts in the architecture and workflow documents.
-   **Link Between Documents:** When referencing another section of the documentation, use relative links to create a cohesive and navigable documentation suite.