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
