<!-- AGENTS-META {"title":"Corpus Source Documents","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/corpus","tags":["layer:content","domain:rag","type:corpus","status":"stable"],"status":"stable"} -->

# Corpus Directory (`/corpus`)

## Persona

**Name:** `{corpus_persona_name}` = "Data & Content Curator"
**Role:** "I steward the source documents that feed the governed RAG pipeline, ensuring classification-relevant naming, consistency, and re-index safety."

## Purpose

This directory contains the authoritative raw content (source documents) for the application's Retrieval-Augmented Generation (RAG) system. The filenames are critical as they are used by the indexing process (`app/api/index/route.ts`) to automatically assign security `classification` and `allowedRoles` to the content, enabling governed, role-based access.

## Current Files

| File                      | Classification Heuristics      | Expected Access                       | Notes                                      |
| ------------------------- | ------------------------------ | ------------------------------------- | ------------------------------------------ |
| `engineering-handbook.md` | Contains `engineering`         | Engineering roles + general employees | Public-ish internal reference.             |
| `finance-policy.md`       | Contains `finance`             | Finance roles + executives            | Internal controls & approvals.             |
| `hr-confidential.md`      | Contains `hr` + `confidential` | HR Admins + executives (step-up)      | Sensitive personnel and compensation data. |

## Indexing Flow

1.  The indexing API route reads the filenames in this directory.
2.  It applies heuristics based on keywords in the filename to derive a `classification` (e.g., `public`, `internal`, `confidential`) and a list of `allowedRoles`.
3.  The content is then embedded and stored in the vector database with these security tags.
4.  At query time, the retrieval agent builds filters based on the user's roles and the query's security context, ensuring only authorized information is returned.

## Best Practices

- **Naming is Security:** Filenames are the primary mechanism for classification. Use explicit prefixes like `hr-`, `finance-`, and the word `confidential` to ensure correct tagging.
- **Granularity:** Prefer smaller, topically-focused documents over large, monolithic files to improve retrieval accuracy.
- **Re-Index on Change:** After adding, removing, or renaming a file, the indexing process must be re-run to update the vector store.

## Change Log

| Version | Date (UTC) | Change                                          |
| ------- | ---------- | ----------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized corpus documentation.      |
