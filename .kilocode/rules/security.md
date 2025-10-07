# Security and Config Kilocode rule (security.md)

Scope

- Apply to secrets, config, vector store and runtime validation.
- Targets: [`src/mastra/config/vector-store.ts:1`](src/mastra/config/vector-store.ts:1), [`.env.example:1`](.env.example:1)

Principles

- Fail-safe defaults and explicit validation.
- Secrets never in client code or committed config.
- Validate critical runtime invariants at startup.

Rules

1. Secrets and config

- All secrets must be provided via environment variables or a secret manager; never commit secrets to repo.
- .env.example must contain only placeholders and no real secrets.
- Checklist:
    - [ ] no secrets in repo
    - [ ] .env.example has placeholders only

2. Runtime validation

- Services must validate critical config at startup and fail fast on misconfiguration.
- Vector store config must validate expected embedding dimension and connection settings.
- Checklist:
    - [ ] startup config validation present
    - [ ] vector-store dimension and endpoint validated

3. Embedding dimension and model bindings

- Enforce embedding dimension checks before upsert or query. Reference: [`src/mastra/config/vector-store.ts:1`](src/mastra/config/vector-store.ts:1)
- Model to embedding-dimension mapping must be explicit in config.
- Checklist:
    - [ ] embedding dimension constant defined and used
    - [ ] model to dimension mapping documented

4. Secrets access patterns

- Use a secret accessor utility (getSecret) centralizing retrieval and rotation.
- Avoid direct process.env reads across many files; centralize in config layer.
- Checklist:
    - [ ] secret accessor exists and is used

5. Transport and storage security

- Vector stores and external APIs must use TLS and validated certificates.
- Stored logs must not contain raw secrets or PII.
- Checklist:
    - [ ] TLS enforced for external services
    - [ ] logs scrub secrets

Reviewer checklist (PR)

- [ ] No secrets added in PR
- [ ] Config validation added or unchanged
- [ ] Vector config references [`src/mastra/config/vector-store.ts:1`](src/mastra/config/vector-store.ts:1)

Enforcement suggestions

- Provide a startup validation script snippet that runs on app boot and CI (advisory).
- Add an optional pre-commit secret-scan check for developer machines.

Next steps

- File written to .kilocode/rules/security.md as draft.
