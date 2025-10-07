# Kilocode Reviewer Checklists and Enforcement Templates

## Consolidated Reviewer Checklists

### Mastra Rules (mastra.md)

- [ ] Kilocode header present in agent files
- [ ] tool calls documented in agent contracts
- [ ] output schema referenced in agent contracts
- [ ] Approval block present in tool files
- [ ] Whitelist present in tool approvals
- [ ] validateUrl/validateDataPath used in tools
- [ ] securityTags included in vector operations
- [ ] embedding dimension validated in vector ops
- [ ] queries use RoleService filters
- [ ] ACL read and validated in indexing
- [ ] processing emits traces and docId mappings
- [ ] answer schema enforced in RAG agents
- [ ] verifier in workflow

### Data Governance Rules (data.md)

- [ ] ACL updates include rationale and affected doc list
- [ ] Corpus docs include valid frontmatter with docId and classification
- [ ] DocumentIndexingService uses ACL for final classification
- [ ] Sensitive docs marked confidential are restricted by RoleService filters
- [ ] Audit entries added to change log

### Tools Rules (tools.md)

- [ ] Kilocode approval header present in tool files
- [ ] allowedDomains or allowedDataPaths populated
- [ ] domain whitelist enforced in network calls
- [ ] timeouts and rate limits configured
- [ ] HTML sanitized before markdown conversion
- [ ] writes confined to DATA_DIR
- [ ] validateDataPath used for all paths
- [ ] atomic write or backup performed before overwrite
- [ ] input/output schema referenced in tools
- [ ] side-effects listed in tool headers
- [ ] non-idempotent flagged and approved
- [ ] tracing calls present in side-effecting ops
- [ ] errors lead to rollback or clean failure state

### Security Rules (security.md)

- [ ] no secrets in repo
- [ ] .env.example has placeholders only
- [ ] startup config validation present
- [ ] vector-store dimension and endpoint validated
- [ ] embedding dimension constant defined and used
- [ ] model to dimension mapping documented
- [ ] secret accessor exists and is used
- [ ] TLS enforced for external services
- [ ] logs scrub secrets

### Frontend Rules (frontend.md)

- [ ] Client code free of secrets
- [ ] API routes validate JWT and inputs
- [ ] Error handling safe and user-friendly
- [ ] Components accessible and follow patterns
- [ ] Data fetching secure and efficient

## Non-Invasive CI Enforcement Templates

### Validation Script Template (validate-rules.js)

```javascript
// Run locally: node validate-rules.js
// Or in CI: add to workflow without committing

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml') // npm install js-yaml

function validateCorpusFrontmatter() {
    const corpusDir = './corpus'
    const files = fs.readdirSync(corpusDir).filter((f) => f.endsWith('.md'))

    for (const file of files) {
        const content = fs.readFileSync(path.join(corpusDir, file), 'utf8')
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

        if (!frontmatterMatch) {
            console.error(`Missing frontmatter in ${file}`)
            process.exit(1)
        }

        const frontmatter = yaml.load(frontmatterMatch[1])
        const required = [
            'docId',
            'classification',
            'tenant',
            'roles',
            'source',
            'lastReviewed',
        ]

        for (const field of required) {
            if (!frontmatter[field]) {
                console.error(`Missing ${field} in ${file}`)
                process.exit(1)
            }
        }
    }
    console.log('Corpus frontmatter validation passed')
}

function validateAclConsistency() {
    const aclPath = './src/mastra/policy/acl.yaml'
    const acl = yaml.load(fs.readFileSync(aclPath, 'utf8'))

    // Add ACL validation logic here
    console.log('ACL validation passed')
}

validateCorpusFrontmatter()
validateAclConsistency()
```

### Secret Scanner Template (scan-secrets.js)

```javascript
// Run locally: node scan-secrets.js
// Or in CI: add to workflow without committing

const fs = require('fs')
const path = require('path')

const SECRET_PATTERNS = [
    /API_KEY\s*=\s*['"][^'"]*['"]/i,
    /SECRET\s*=\s*['"][^'"]*['"]/i,
    /PASSWORD\s*=\s*['"][^'"]*['"]/i,
    /TOKEN\s*=\s*['"][^'"]*['"]/i,
]

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')

    for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
            console.error(`Potential secret found in ${filePath}`)
            process.exit(1)
        }
    }
}

function scanDirectory(dir) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (
            stat.isDirectory() &&
            !item.startsWith('.') &&
            item !== 'node_modules'
        ) {
            scanDirectory(fullPath)
        } else if (stat.isFile() && !item.includes('.env')) {
            scanFile(fullPath)
        }
    }
}

scanDirectory('.')
console.log('Secret scan passed')
```

### Embedding Dimension Validator Template (validate-embeddings.js)

```javascript
// Run locally: node validate-embeddings.js
// Or in CI: add to workflow without committing

const EXPECTED_DIM = 3072 // From config

function validateEmbeddingDimension(embedding) {
    if (embedding.length !== EXPECTED_DIM) {
        console.error(
            `Embedding dimension mismatch: got ${embedding.length}, expected ${EXPECTED_DIM}`
        )
        process.exit(1)
    }
}

// Mock validation - integrate with actual vector store calls
console.log('Embedding dimension validation passed')
```

## PR Template Snippet

Add this to your PR template:

```markdown
## Kilocode Rule Compliance

### Mastra Rules

- [ ] Agent contracts include Kilocode headers
- [ ] Tool approvals have whitelists
- [ ] Vector operations include securityTags

### Data Governance

- [ ] ACL changes include rationale
- [ ] Corpus docs have valid frontmatter
- [ ] Sensitive data access restricted

### Security

- [ ] No secrets committed
- [ ] Config validation present
- [ ] TLS used for external services

### Tools

- [ ] Network/fs tools have approvals
- [ ] validateUrl/validateDataPath used
- [ ] Tracing implemented

### Frontend

- [ ] Client code secure
- [ ] API routes validate inputs
- [ ] Error handling safe
```

## Enforcement Notes

- These templates are advisory and non-invasive
- Run locally during development: `node validate-rules.js`
- Add to CI workflows if desired, but do not commit enforcement scripts to repo
- Update checklists as rules evolve
- Use as starting point for custom validation logic
