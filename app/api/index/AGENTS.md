<!-- AGENTS-META {"title":"Indexing API Route","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app/api/index","tags":["layer:backend","domain:rag","type:api","status:stable"],"status":"stable"} -->

# Index API (`/api/index`)

## Persona
**Name:** Data Ingestion & Indexing Engineer  
**Role Objective:** Provide a secure, deterministic document ingestion endpoint that assigns classification & allowed roles and invokes the governed indexing workflow.  
**Prompt Guidance Template:**

```text
You are the {persona_role} responsible for {responsibility_summary}.
Constraints:
1. MUST only perform: file discovery, metadata assignment, workflow invocation.
2. MUST NOT embed parsing logic for complex formats (delegate to preprocessing service if added).
3. MUST enforce deterministic security classification rules.
4. MUST log summary counts (total, indexed, failed) not raw document contents.
Forbidden:
- Hardcoded file lists.
- Ad-hoc vector store writes bypassing workflow.
- Inconsistent classification heuristics.
Return only minimal code changes required.
```

Where:

- `{persona_role}` = "Data Ingestion & Indexing Engineer"
- `{responsibility_summary}` = "scanning corpus, enriching with security metadata, invoking indexing workflow"

## Purpose
Trigger governed bulk ingestion of local corpus markdown (and future supported formats) into the vector store via `governed-rag-index` workflow.

## Scope
### In-Scope

- Corpus directory scan (`/corpus`)
- Heuristic metadata assignment (classification + allowedRoles)
- Workflow invocation & result summarization
- Execution time configuration (`maxDuration`)

### Out-of-Scope

- Embedding model selection logic
- Vector persistence internals
- Background job orchestration (future enhancement)

## Key File

| File | Responsibility | Notes |
|------|----------------|-------|
| `route.ts` | Read corpus, classify, invoke workflow, return summary JSON | Uses Node `fs`, `path`, and Mastra workflow registry |

## Classification Rules (Current Heuristics)
 
| Pattern Match | Classification | allowedRoles | Rationale |
|---------------|---------------|--------------|-----------|
| `confidential` in filename | confidential | admin,dept_admin | Highest sensitivity marker |
| `finance` in filename | internal | admin,finance,dept_admin | Finance restricted info |
| `hr` in filename | confidential | admin,hr,dept_admin | Personnel / HR sensitive |
| default | public | public,employee | General accessible content |

TODO (Future): Replace heuristics with manifest (`corpus/manifest.json`) or embedded front-matter.

## Data Flow

1. Client (or CLI) sends POST `/api/index` (optional body for future filters).
2. Handler enumerates `/corpus` for supported extensions (`.md`).
3. For each file → read content → determine security metadata via rule table.
4. Build `DocumentInput[]` payload.
5. Invoke `governed-rag-index` workflow with `{ documents }`.
6. Await completion → derive counts (indexed, failed) → return JSON summary.

## Validation & Safety Checklist

| Concern | Action | Failure Response |
|---------|--------|------------------|
| Directory access | Use controlled relative path | 500 if unreadable |
| Empty corpus | Return 200 with `indexed:0` | Not an error |
| Unsupported file type | Skip & count in `skipped` | Included in summary |
| Large file size (future) | Add size guard | 413 (planned) |

## Best Practices

1. Deterministic classification logic—centralize in one function.
2. Avoid reading large files into memory repeatedly (single read per file).
3. Log structural metadata only (names, counts) – never PII contents.
4. Keep handler synchronous CPU minimal (O(n) scan only).
5. Fail fast on filesystem errors before workflow start.

## Anti-Patterns

- Embedding embedding/generation logic in route.
- Copying classification heuristics into another route (single source here or future service).
- Silently swallowing read errors (must surface in summary `failed`).

## Common Tasks

| Task | Steps |
|------|-------|
| Support new extension (e.g., `.txt`) | Extend filter; add parser if needed; update rule application |
| Add manifest-based metadata | Read `manifest.json`; override heuristic results |
| Add async background job | Return 202 with job id; move workflow call to queue consumer |
| Add PDF support | Integrate parser (e.g., `pdf-parse`); extract text; preserve original filename |

## Error Strategy

| Scenario | Response | Status |
|----------|----------|--------|
| FS read failure | `{ error: 'Filesystem error' }` | 500 |
| Workflow failure | `{ error: 'Indexing failed', details }` | 500 |
| Partial success | `{ indexed, failed }` | 200 |

## Security Notes

- Enforced least privilege via `allowedRoles` mapping.
- No raw token validation here (JWT used upstream if needed for restricted runs).
- Prevent path traversal: never accept client-provided filenames.

## Performance Considerations

- Single pass directory scan.
- Optional future parallel reads (bounded concurrency) if corpus grows.
- Increase `maxDuration` only if workflow latency requires (currently 300s).

## Observability

- Log: total files, indexed count, failed count, duration ms.
- Future: structured per-file results to tracing system (avoid log spam).

## Pitfalls

- Divergent classification logic across routes.
- Blocking large file parsing inline (offload to preprocessing service).
- Forgetting to update rule table when adding new security levels.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# API - Index

## Persona

* **`name`**: "Data Pipeline Engineer"
* **`role_description`**: "I am responsible for the data ingestion and processing pipelines. My primary focus is on creating robust, efficient, and reliable systems for getting data into our vector store. I handle file system operations, data validation, and orchestrating the indexing workflows."
* **`generation_parameters`**:
  * **`style`**: "Process-oriented and clear. Detail the steps of the indexing process. Use file paths and code snippets for clarity."
  * **`output_format`**: "Markdown with TypeScript code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before modifying this route, I must ask: 'Is the file path handling secure? Is the logic for assigning classifications and roles correct and maintainable? How are errors during the workflow handled and reported?'"
  * **`interaction_example`**:
    * *User Prompt:* "Add support for PDF files in the indexing process."
    * *Ideal Response:* "Understood. To add PDF support, I will first need a library to parse PDF text content, such as `pdf-parse`. Then, in the `POST` handler of `route.ts`, I will modify the `fs.readdirSync` logic to also look for `.pdf` files. When a PDF is found, I will use the parsing library to extract its text before passing it to the `governed-rag-index` workflow. This ensures the workflow only ever has to deal with plain text content."

### Directory Analysis

* **`purpose`**: To provide a backend endpoint for triggering the document indexing process.
* **`file_breakdown`**:
  * `route.ts`: Exports a `POST` function that reads the contents of the `/corpus` directory, determines the appropriate security metadata for each file, and then initiates the `governed-rag-index` Mastra workflow.
* **`key_abstractions`**:
  * **File System Interaction**: This route uses the Node.js `fs` and `path` modules to read the `/corpus` directory. This is a key interaction with the server's file system.
  * **Dynamic Metadata Assignment**: The logic within the `POST` handler that inspects filenames (e.g., `fileName.includes('confidential')`) to dynamically assign `classification` and `allowedRoles` is a core feature of the security model's ingestion side.
  * **Workflow Invocation**: The route calls `mastra.getWorkflows()['governed-rag-index']` to get a reference to the indexing workflow and then starts it with the prepared document list.
  * **`maxDuration`**: This is set to 300 seconds (5 minutes) to accommodate potentially long indexing jobs for many or large documents.
* **`data_flow`**:
    1. The frontend (or a curl command) sends a `POST` request to `/api/index`.
    2. The handler reads all `.md` files from the local `/corpus` directory.
    3. It iterates through each file, creating a `DocumentInput` object and assigning `classification` and `allowedRoles` based on the filename.
    4. This array of `DocumentInput` objects is passed as `inputData` to the `governed-rag-index` workflow.
    5. The handler awaits the workflow's completion and returns a JSON response summarizing the results (e.g., number of indexed/failed documents).

### Development Playbook

* **`best_practices`**:
  * "**Centralized Indexing Logic**: This route is the single entry point for all document indexing. All new indexing tasks should be initiated through this endpoint to ensure consistency."
  * "**Separation from Corpus**: The logic for assigning metadata is here in the API route, while the content itself is in `/corpus`. This is a good separation of concerns."
  * "**Clear Logging**: The route uses the `logger` to provide clear, structured logs about which documents are being indexed and the final outcome. This is essential for debugging ingestion issues."
* **`anti_patterns`**:
  * "**Hardcoding File Paths**: The current implementation dynamically reads the `/corpus` directory, which is good. Avoid modifying it to use a hardcoded list of files, as this would make adding new documents more difficult. **Instead**: Enhance the dynamic logic if needed, for example, by reading metadata from a manifest file instead of the filename."
  * "**Blocking the Main Thread**: For very large indexing jobs, this synchronous `await` could potentially block the serverless function for a long time. **Instead**: For a production system with thousands of documents, consider refactoring this to a background job pattern. The API could return an immediate `202 Accepted` response with a job ID, and the client could poll a separate status endpoint."
* **`common_tasks`**:
  * "**Supporting a New Document Type**:
        1. In `route.ts`, update the `fs.readdirSync` filter to include the new file extension (e.g., `.txt`).
        2. Add logic to the mapping function to handle the new file type, potentially including a new content parser if it's not plain text.
        3. Add a new `if/else if` condition to assign the correct `classification` and `allowedRoles` for this new document type."
* **`debugging_checklist`**:
    1. "Is a document not being indexed? Check the server logs to see if the file is being found by `fs.readdirSync`. Verify the filename matches the conditions in the `if/else if` blocks."
    2. "Is the workflow failing? Check the logs for errors coming from the `governed-rag-index` workflow itself. The issue might be in the document processing services, not the API route."
    3. "Is a document getting the wrong permissions? The logic for assigning `classification` and `allowedRoles` in this file is the place to debug. `console.log` the `fileName` and the metadata being assigned for each document."
<-- End Legacy -->
```
