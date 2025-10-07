# Security Guidelines & Patterns

## Core Security Principles

### Zero Trust Architecture

- **Never trust, always verify**: Every request must be authenticated and authorized
- **Principle of least privilege**: Users only access what they need for their role
- **Defense in depth**: Multiple security layers prevent single points of failure
- **Fail secure**: System defaults to denying access when in doubt

### Security-First RAG Design

- **Database-level filtering**: Security applied at vector query time, not post-retrieval
- **No external knowledge**: Agents NEVER use knowledge outside provided contexts
- **Multi-agent verification**: Independent verification agent validates all responses
- **Audit trail**: All security decisions logged with full context

## Authentication & Authorization

### JWT Token Structure

```typescript
{
  sub: "user@example.com",           // User identifier
  roles: ["finance.viewer"],         // Array of assigned roles
  tenant: "acme",                    // Tenant isolation
  stepUp: false,                     // Elevated privileges flag
  exp: 1234567890,                   // Expiration timestamp
  iat: 1234567890                    // Issued at timestamp
}
```

### Role Hierarchy System

```typescript
// Higher privilege roles inherit lower privilege access
'admin': ['hr.admin', 'finance.admin', 'engineering.admin', 'employee', 'public']
'finance.admin': ['finance.viewer', 'employee', 'public']
'finance.viewer': ['employee', 'public']
'employee': ['public']
'public': []
```

### Step-Up Authentication

- **Confidential Access**: Requires `stepUp: true` in JWT claims
- **Time-Limited**: Step-up sessions should have shorter expiry
- **Audit Required**: All step-up access must be logged and monitored

## Document Classification System

### Classification Levels

1. **Public**: Accessible to all authenticated users
    - Company policies, general announcements
    - Security tags: `classification:public`, `role:public`

2. **Internal**: Department or role-specific access
    - Department policies, internal procedures
    - Security tags: `classification:internal`, `role:department.viewer`

3. **Confidential**: Admin access with step-up authentication
    - Sensitive HR data, financial records, legal documents
    - Security tags: `classification:confidential`, `role:admin`

### Security Tagging Schema

```typescript
// Required tags for all documents
securityTags: [
    'classification:internal', // Document sensitivity level
    'role:finance.viewer', // Required role for access
    'tenant:acme', // Tenant isolation
]
```

## Access Control Implementation

### Vector Query Filtering

```typescript
// Qdrant filter structure for secure queries
const qdrantFilter = {
    must: [
        // Classification level check
        {
            key: 'securityTags',
            match: {
                any: ['classification:public', 'classification:internal'],
            },
        },
        // Role-based access (with hierarchy expansion)
        {
            key: 'securityTags',
            match: {
                any: ['role:finance.viewer', 'role:employee', 'role:public'],
            },
        },
        // Tenant isolation
        {
            key: 'securityTags',
            match: { any: ['tenant:acme'] },
        },
    ],
}
```

### Role Expansion Logic

```typescript
// Example: finance.viewer inherits employee and public access
const userRoles = ['finance.viewer']
const expandedRoles = RoleService.expandRoles(userRoles)
// Result: ["finance.viewer", "employee", "public"]
```

## Security Validation Patterns

### Input Validation

- **Zod Schemas**: All inputs validated with runtime type checking
- **JWT Validation**: Token signature, structure, expiry, and claims
- **Query Sanitization**: Prevent injection attacks in vector queries
- **File Validation**: Document type and content validation during indexing

### Multi-Layer Authorization

1. **JWT Verification**: Valid token with proper signature
2. **Role Validation**: User roles exist in hierarchy system
3. **Policy Generation**: Convert roles to security filters
4. **Database Filtering**: Apply filters at Qdrant query level
5. **Response Validation**: Verify answer uses only authorized contexts

### Answer Security Verification

```typescript
// Verifier agent checks for data leakage
const verification = {
    contextCheck: 'Answer only uses provided contexts',
    relevanceCheck: 'Answer addresses the specific question',
    securityCheck: 'No unauthorized information disclosed',
    citationCheck: 'All claims properly cited',
}
```

## Security Logging & Monitoring

### Required Security Events

- **Authentication**: JWT verification success/failure
- **Authorization**: Role-based access decisions
- **Data Access**: Document retrieval with user context
- **Policy Violations**: Attempted unauthorized access
- **Step-Up Events**: Elevated privilege usage

### Log Structure

```typescript
{
  timestamp: "2024-01-01T12:00:00Z",
  event: "document_access",
  user: "user@example.com",
  roles: ["finance.viewer"],
  tenant: "acme",
  documents: ["finance-policy-001"],
  classification: "internal",
  requestId: "REQ-123456789-abc12"
}
```

## Common Security Anti-Patterns to Avoid

### ❌ Post-Retrieval Filtering

```typescript
// WRONG: Filtering after retrieval
const allDocs = await vectorStore.query(embedding)
const filtered = allDocs.filter((doc) => userCanAccess(doc))
```

### ✅ Database-Level Filtering

```typescript
// CORRECT: Filtering at query time
const secureFilter = buildSecurityFilter(userRoles, tenant)
const docs = await vectorStore.query(embedding, { filter: secureFilter })
```

### ❌ External Knowledge in Answers

```typescript
// WRONG: Using external knowledge
if (contexts.length === 0) {
    return 'Based on general knowledge, expense policies typically...'
}
```

### ✅ Context-Only Responses

```typescript
// CORRECT: Only use provided contexts
if (contexts.length === 0) {
    return 'No authorized documents found that contain information about this topic.'
}
```

### ❌ Role Hardcoding

```typescript
// WRONG: Hardcoded role checks
if (user.role === 'admin' || user.role === 'finance.admin') {
    // allow access
}
```

### ✅ Hierarchical Role System

```typescript
// CORRECT: Use role hierarchy
if (RoleService.canAccessRole(user.roles, 'finance.viewer')) {
    // allow access
}
```

## Security Testing Guidelines

### Authentication Testing

- Test JWT validation with invalid signatures
- Test expired tokens
- Test malformed JWT structure
- Test missing required claims

### Authorization Testing

- Test role hierarchy inheritance
- Test tenant isolation
- Test step-up authentication requirements
- Test classification level enforcement

### Data Leakage Testing

- Verify no external knowledge in responses
- Test cross-tenant data access prevention
- Verify proper citation requirements
- Test answer verification agent effectiveness

## Compliance Considerations

### GDPR/Privacy

- User consent for data processing
- Right to data deletion
- Data minimization principles
- Audit trail for data access

### SOX/Financial Compliance

- Segregation of duties in role design
- Audit trail for financial document access
- Change management for security policies
- Regular access reviews

### HIPAA/Healthcare

- Minimum necessary standard
- Access logging and monitoring
- Encryption at rest and in transit
- Business associate agreements
