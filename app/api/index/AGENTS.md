<!-- AGENTS-META {"title":"Indexing API Route","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app/api/index","tags":["layer:backend","domain:rag","type:api","status":"stable"],"status":"stable"} -->

# Index API (`/api/index`)

## Persona

**Name:** Data Ingestion & Indexing Engineer
**Role Objective:** Provide a secure, deterministic document ingestion endpoint that assigns classification & allowed roles and invokes the governed indexing workflow.

## Directory Purpose

This API route triggers the governed bulk ingestion of documents from the local `/corpus` directory into the vector store. It uses the `governed-rag-index` Mastra workflow to handle the processing.

## Scope

### In-Scope

- Scanning the `/corpus` directory for markdown files.
- Applying heuristic-based security metadata (classification and roles) to each document.
- Invoking the `governed-rag-index` workflow.
- Returning a JSON summary of the indexing operation.

### Out-of-Scope

- The embedding process itself (handled by the workflow and services).
- Vector store persistence logic (handled by services).
- Background job orchestration.

## Key File

| File       | Responsibility                                                               | Notes                                                         |
| ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `route.ts` | Reads corpus, classifies documents, invokes workflow, and returns a summary. | Uses Node.js `fs` and `path` to interact with the filesystem. |

## Classification Rules (Current Heuristics)

| Pattern Match in Filename | Classification | `allowedRoles`                                        | Rationale                                    |
| ------------------------- | -------------- | ----------------------------------------------------- | -------------------------------------------- |
| `confidential` or `hr`    | `confidential` | `hr.admin`                                            | Highest sensitivity for HR data.             |
| `finance` or `policy`     | `internal`     | `finance.viewer`, `finance.admin`, `employee`         | Finance-restricted information.              |
| `engineering`             | `internal`     | `engineering.admin`, `engineering.viewer`, `employee` | Engineering-specific internal documents.     |
| _default_                 | `public`       | `employee`                                            | General content accessible by all employees. |

## Data Flow

1.  A `POST` request is sent to `/api/index`.
2.  The handler reads all `.md` files from the `/corpus` directory.
3.  It iterates through each file, assigning a `classification` and `allowedRoles` based on the filename heuristics (see table above).
4.  An array of `DocumentInput` objects is constructed.
5.  The `governed-rag-index` workflow is invoked with the document list.
6.  The handler awaits the workflow's completion and returns a JSON response summarizing the results.

## Change Log

| Version | Date (UTC) | Change                                                      |
| ------- | ---------- | ----------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Synchronized content with source code and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.                         |
