# Demo Roles

This page demonstrates role-based access in the Mastra Governed RAG using sample queries against the corpus documents. Use the UI's AuthPanel or `scripts/make-jwt.js` to generate JWTs for testing.

## Role Examples

Roles are hierarchical (see [Security](./security.md)). Max classification and allowed tags determine access.

### 1. Public User (role: "public")

- **Access**: Only public content (none in corpus).
- **Max Classification**: public
- **Allowed Tags**: None specific.

**Sample Query**: "What is the expense reimbursement policy?"

- **Expected Response**: "No authorized documents found that contain information about this topic."
- **Reason**: All corpus docs are internal/confidential.

### 2. Employee (role: "employee")

- **Access**: Inherits public; general internal docs (but corpus is department-specific).
- **Max Classification**: internal
- **Allowed Tags**: General (no dept tags).

**Sample Query**: "What is the engineering code review process?"

- **Expected Response**: Access to engineering-handbook.md (internal, employee allowed).
    - Answer: "All code must be peer-reviewed... Minimum 2 approvals for production code."
    - Citations: [{"docId": "engineering-handbook-001", "source": "Engineering Team Handbook"}]
- **Sample Query**: "What is executive compensation?"
- **Expected Response**: "No authorized documents found..."
- **Reason**: hr-confidential.md is confidential/hr.admin only.

### 3. Finance Viewer (role: "finance.viewer")

- **Access**: Inherits employee/public; finance-specific internal.
- **Max Classification**: internal
- **Allowed Tags**: ['finance']

**Sample Query**: "What are the approval thresholds for expenses?"

- **Expected Response**: Access to finance-policy.md.
    - Answer: "Expenses under $500: Direct manager... over $1000: CFO approval..."
    - Citations: [{"docId": "finance-policy-001", "source": "Finance Department Policy Manual"}]
- **Sample Query**: "What is the engineering on-call schedule?"
- **Expected Response**: Access (employee inheritance).
    - Answer: "Weekly rotations starting Monday 9 AM... Compensation: $500/week..."
    - Citations: engineering-handbook.

**Sample Query**: "Executive severance packages?"

- **Expected Response**: No access (confidential).
- **Reason**: Tag/role mismatch.

### 4. HR Admin (role: "hr.admin")

- **Access**: Inherits hr.viewer/employee/public; confidential HR.
- **Max Classification**: confidential
- **Allowed Tags**: ['hr']

**Sample Query**: "What are the executive compensation bands?"

- **Expected Response**: Access to hr-confidential.md.
    - Answer: "CEO: Base $850,000... C-Suite: $450k-$550k base..."
    - Citations: [{"docId": "hr-conf-001", "source": "HR Confidential Documents"}]
- **Sample Query**: "Finance budget overrun policy?"
- **Expected Response**: Access via employee (internal).
    - Answer: "Any projected overrun exceeding 10% must be reported..."
    - Citations: finance-policy.

**Sample Query**: "Engineering performance standards?"

- **Expected Response**: Access (employee).
    - Citations: engineering-handbook.

### 5. Admin (role: "admin")

- **Access**: Full inheritance; all classifications/tags.
- **Max Classification**: confidential
- **Allowed Tags**: All depts.

**Sample Query**: Any from corpus.

- **Expected Response**: Full access to all docs, answers with citations from relevant sources.
- **Example**: Query HR confidential as admin → full executive comp details.

## Testing in UI/CLI

1. **UI**:
    - Open <http://localhost:3000>.
    - AuthPanel: Select role, generate JWT, paste.
    - Chat: Ask query, see streaming answer + citations.

2. **CLI**:

    ```bash
    npm run cli query "JWT_FOR_FINANCE_VIEWER" "Expense policy?"
    ```

    - Logs: Answer + citations.

3. **Expected Behaviors**:
    - Unauthorized: Polite denial, no leakage.
    - Authorized: Accurate answer with sources.
    - Verification: Workflow fails if answer violates policy.

For custom roles, modify [role-hierarchy](../src/mastra/config/role-hierarchy.ts). See [API Reference](./api-reference.md) for endpoint testing.
