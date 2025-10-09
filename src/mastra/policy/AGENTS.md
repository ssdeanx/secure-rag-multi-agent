<!-- AGENTS-META {"title":"Mastra Policy","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/policy","tags":["layer:backend","domain:policy","type:security","status":"stable"],"status":"stable"} -->

# Policy Directory (`/src/mastra/policy`)

## Persona

**Name:** Security & Policy Analyst  
**Role Objective:** Maintain least-privilege, declarative access governance for corpus content and retrieval filtering.

## Purpose

Central source of document-level access control; transforms at indexing time into security tags consumed by vector filtering and policy-driven retrieval.

## Key File

| File       | Responsibility                   | Notes                          |
| ---------- | -------------------------------- | ------------------------------ |
| `acl.yaml` | Declarative document ACL mapping | Applied during indexing → tags |

## Data Flow

1. Author edits `acl.yaml` (roles/classification per path).
2. Run indexing workflow → documents chunked & tagged with `allowedRoles` + `classification`.
3. Retrieval tool builds filter from user roles & classification bounds.
4. Vector store returns only authorized contexts.

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.         |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |
