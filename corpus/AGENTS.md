<!-- AGENTS-META {"title":"Corpus Source Documents","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/corpus","tags":["layer:content","domain:rag","type:corpus","status:stable"],"status":"stable"} -->

# Corpus Directory (`/corpus`)

## Persona

**Name:** `{corpus_persona_name}` = "Data & Content Curator"  
**Role:** "I steward the source documents that feed the governed RAG pipeline, ensuring classification-relevant naming, consistency, and re-index safety."  
**Core Goals:**

1. Maintain high-signal, minimal noise Markdown sources.
2. Preserve naming conventions that drive automatic classification.
3. Ensure sensitive documents are clearly identifiable for policy filters.
4. Trigger re-index operations only when required.

**MUST:**

- Store only Markdown `.md` sources.
- Follow naming heuristics (e.g., `hr-` / `confidential` / `finance`).
- Keep document scope narrowly focused per file.
- Communicate when deletions require cleanup (stale vectors) via re-index.

**FORBIDDEN:**

- Embedding credentials or secrets.
- Dumping large, unstructured logs or exports.
- Mixing unrelated policy domains in one file.

## Purpose

Authoritative raw content for indexing into the vector store. Filenames guide automatic `classification` & `allowedRoles` logic inside `app/api/index/route.ts`.

## Current Files

| File                      | Classification Heuristics      | Expected Access              | Notes                         |
| ------------------------- | ------------------------------ | ---------------------------- | ----------------------------- |
| `engineering-handbook.md` | Contains `engineering`         | engineering roles + employee | Public-ish internal reference |
| `finance-policy.md`       | Contains `finance`             | finance roles + exec         | Internal controls & approvals |
| `hr-confidential.md`      | Contains `hr` + `confidential` | hr.admin + exec (step-up)    | Sensitive personnel guidance  |

## Indexing Flow

1. Index route reads filenames.
2. Applies heuristics → derives `classification` & `allowedRoles`.
3. Embeds content & stores vectors with security tags.
4. Retrieval filters by both role and classification at query time.

## Best Practices

| Area           | Guidance                                                         |
| -------------- | ---------------------------------------------------------------- |
| Naming         | Use explicit domain prefixes (`hr-`, `finance-`, `engineering-`) |
| Granularity    | Prefer smaller topical docs over monoliths                       |
| Sensitivity    | Include `confidential` in filename for high-sensitivity items    |
| Change Control | Batch related edits then re-index once                           |
| Removal        | After deleting a file, run a cleanup or full re-index            |

## Common Mistakes & Anti-Patterns

| Mistake                                  | Impact             | Fix                          |
| ---------------------------------------- | ------------------ | ---------------------------- |
| Adding PDF/unsupported binary            | Ignored or failure | Convert to Markdown          |
| Vague filenames                          | Misclassification  | Rename with domain prefix    |
| Combining confidential + public sections | Leakage risk       | Split into separate files    |
| Large policy dump                        | Retrieval noise    | Break into thematic sections |

## Re-Index Triggers

Trigger a re-index when:

- Adding/removing a file.
- Changing filename (affects heuristics).
- Substantial content edits (semantics shift).
- Updating classification logic in index route.

## Validation Checklist

- [ ] File uses `.md` extension.
- [ ] Filename encodes domain & sensitivity.
- [ ] No secrets or personal data beyond policy scope.
- [ ] Content written in clear, answerable sections.
- [ ] Change logged (if governance requires audit).

## Future Enhancements

- Add frontmatter for explicit classification (override heuristics).
- Introduce checksum tracking to detect drift.
- Add automated diff-based partial re-index.

## Change Log

| Version | Date (UTC) | Change                                               |
| ------- | ---------- | ---------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized corpus documentation + legacy preserved |

## Legacy Content (Preserved)

> Original pre-standardization text retained below.

```markdown
# Corpus

## Persona: Data & Content Curator

### Purpose

This directory serves as the knowledge base for the RAG system. It contains the raw, source documents (in Markdown format) that will be indexed into the vector database. The content of these files is what the AI will use to answer user questions.

### Content Overview

- **`engineering-handbook.md`**: Publicly accessible documentation for the engineering team.
- **`finance-policy.md`**: Internal documentation detailing financial policies.
- **`hr-confidential.md`**: Confidential HR documents with restricted access.

### Best Practices

- **File Naming is Important:** The file names are used in `app/api/index/route.ts` to determine the `classification` and `allowedRoles` for each document during the indexing process. For example, a filename containing "confidential" or "hr" will be automatically tagged as confidential and restricted to HR admins.
- **Markdown Format:** All documents should be in Markdown format. The indexing process reads these `.md` files directly.
- **Adding New Documents:** To add a new document to the knowledge base, simply add a new `.md` file to this directory. Then, update the logic in `app/api/index/route.ts` to assign the correct classification and roles based on the new file's name or content.
- **Updating Content:** To update the knowledge, edit the content of the files in this directory and then re-run the indexing process via the application's UI or the `npm run cli index` command.
```
