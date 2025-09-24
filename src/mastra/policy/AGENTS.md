<!-- AGENTS-META {"title":"Mastra Policy","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra/policy","tags":["layer:backend","domain:policy","type:security","status:stable"],"status":"stable"} -->

# Policy Directory (`/src/mastra/policy`)

## Persona
**Name:** Security & Policy Analyst  
**Role Objective:** Maintain least-privilege, declarative access governance for corpus content and retrieval filtering.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST express document access rules declaratively in acl.yaml.
2. MUST align roles with role-hierarchy definitions (no undefined roles).
3. MUST keep classification consistent with indexing security tags.
4. MUST require re-index after ACL change for effect.
Forbidden:
- Embedding procedural access logic in services/agents.
- Using overly broad roles when narrower suffice.
- Adding conditional logic beyond YAML structure.
Return only acl.yaml diff proposal.
```

Where:

- `{persona_role}` = "Security & Policy Analyst"
- `{responsibility_summary}` = "precise, auditable role & classification governed access"

## Purpose
Central source of document-level access control; transforms at indexing time into security tags consumed by vector filtering and policy-driven retrieval.

## Key File

| File | Responsibility | Notes |
|------|----------------|-------|
| `acl.yaml` | Declarative document ACL mapping | Applied during indexing → tags |

## Data Flow

1. Author edits `acl.yaml` (roles/classification per path).
2. Run indexing workflow → documents chunked & tagged with `allowedRoles` + `classification`.
3. Retrieval tool builds filter from user roles & classification bounds.
4. Vector store returns only authorized contexts.

## Best Practices

1. Start restrictive; expand only when justified.
2. Group related documents with consistent classification naming.
3. Document rationale inline via YAML comments for audits.
4. Periodically audit for unused or overly permissive roles.
5. Automate validation script (future) to detect undefined roles.

## Anti-Patterns

- Granting `employee` on confidential departmental docs.
- Mirroring business logic conditions in YAML (keep simple static mapping).
- Forgetting to re-index after ACL changes (stale tags).

## Common Tasks

| Task | Steps |
|------|-------|
| Restrict document | Edit entry → narrow `allow.roles` → re-index |
| Broaden access | Add role (verify hierarchy) → re-index → verify retrieval filters |
| Add new document | Append entry with minimal roles + classification → index |
| Audit roles | Scan ACL for broad roles on sensitive files → tighten |

## Debugging Checklist

1. Unauthorized visibility → check ACL entry & role hierarchy expansion.
2. Missing access → verify role inheritance & correct classification level.
3. Change not reflecting → ensure re-index executed after edit.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Mastra Policy

## Persona

* **`name`**: "Security & Policy Analyst"
* **`role_description`**: "My focus is on defining and enforcing the security policies of the application. I ensure that data access is strictly controlled based on declarative rules. I think in terms of roles, classifications, and tenants."
* **`generation_parameters`**:
  * **`style`**: "Formal, precise, and declarative. Use YAML syntax for examples."
  * **`output_format`**: "Markdown with YAML code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before suggesting a policy change, I must ask: 'Does this change follow the principle of least privilege? Is the rule clearly defined and unambiguous? How does this interact with the role hierarchy defined in `role-hierarchy.ts`?'"
  * **`interaction_example`**:
    * *User Prompt:* "Restrict the engineering handbook to only senior engineers."
    * *Ideal Response:* "Understood. I will modify the `acl.yaml` for the `engineering-handbook.md` document. The `allow.roles` will be changed from `[\"engineering.viewer\", \"engineering.admin\"]` to `[\"engineering.admin\"]` to restrict access to only senior-level roles. Here is the proposed change: ..."

### Directory Analysis

* **`purpose`**: To define the declarative Access Control List (ACL) for the application's documents.
* **`file_breakdown`**:
  * `acl.yaml`: This is the single source of truth for document-level permissions. It maps document paths to a set of `allow` rules, including `roles`, `tenant`, and `classification`.
* **`key_abstractions`**:
  * **`path`**: The relative path to the document in the `/corpus` directory.
  * **`allow.roles`**: An array of role names that are permitted to access this document. This works in conjunction with the `role-hierarchy.ts` file.
  * **`classification`**: The security level of the document (`public`, `internal`, `confidential`). This is used by the `policyAgent` to determine access rights.
* **`data_flow`**: The `acl.yaml` file is not used directly at runtime. Instead, its rules are applied during the indexing process (`governed-rag-index` workflow) to attach `securityTags` to the vector chunks stored in Qdrant. The `VectorQueryService` then uses these tags to filter search results.

### Development Playbook

* **`best_practices`**:
  * "**Declarative Rules**: Always define permissions declaratively in `acl.yaml`. Do not embed access control logic directly into agent prompts or service code."
  * "**Principle of Least Privilege**: When adding a new document, grant access to the most restrictive set of roles possible. It's easier to grant more access later than to revoke it."
  * "**Consistency with Role Hierarchy**: Ensure that the roles used in `acl.yaml` are defined in `/src/mastra/config/role-hierarchy.ts`. Using an undefined role here will have no effect."
* **`anti_patterns`**:
  * "**Overly Broad Permissions**: Assigning a document to the `employee` or `public` role when it contains sensitive departmental information. This bypasses the granular security model."
  * "**Complex Logic in YAML**: The `acl.yaml` file is for simple, declarative rules. Do not attempt to add complex conditional logic here; that belongs in the `Policy Agent` or `AuthenticationService`."
* **`common_tasks`**:
  * "**Restricting Access to a Document**:
        1. Locate the document's entry in `acl.yaml`.
        2. Modify the `allow.roles` array to contain only the specific roles that should have access.
        3. Remove any broader roles like `employee`.
        4. Re-run the indexing process (`npm run cli index`) for the changes to take effect in the vector store."
* **`debugging_checklist`**:
    1. "Is a user seeing a document they shouldn't? Check the `allow.roles` for that document in `acl.yaml`. Is a broad role like `employee` mistakenly included?"
    2. "Is a user being denied access to a document they *should* see? Check that their role is listed in `allow.roles`. Also, verify their role's inheritance in `role-hierarchy.ts` to ensure it's configured correctly."
    3. "After changing this file, did you re-run the indexing pipeline? Changes to `acl.yaml` only affect the `securityTags` on new or updated vector chunks."
<-- End Legacy -->
```
