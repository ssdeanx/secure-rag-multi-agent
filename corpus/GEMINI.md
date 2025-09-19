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
