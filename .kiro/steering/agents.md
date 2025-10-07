# Agent-Specific Guidelines & Patterns

## Multi-Agent Pipeline Architecture

This system uses a 6-agent pipeline for secure, governed RAG operations. Each agent has a specific responsibility and security constraints.

### Agent Pipeline Flow

```
User Query + JWT → Identity → Policy → Retrieve → Rerank → Answerer → Verifier → Secure Response
```

## Individual Agent Guidelines

### 1. Identity Agent (`identity.agent.ts`)

**Purpose**: JWT token validation and claims extraction

**Key Patterns**:

```typescript
export const identityAgent = new Agent({
    id: 'identity',
    name: 'identity',
    model: openAIModel,
    instructions: `You are an identity extraction agent. Your task is to:
1. Call the jwt-auth tool with the provided JWT token
2. Return the extracted claims in the exact format received
3. If the JWT is invalid or expired, return an error message

Always use the jwt-auth tool - never attempt to decode JWTs manually.`,
    tools: { jwtAuth: jwtAuthTool },
})
```

**Critical Rules**:

- ALWAYS use `jwtAuthTool` - never decode JWTs manually
- Return claims in exact format received from tool
- Handle invalid/expired tokens with clear error messages
- No external processing of JWT structure

### 2. Policy Agent (`policy.agent.ts`)

**Purpose**: Convert user claims to access control filters

**Key Patterns**:

- Extract roles and create `role:<role>` tags
- Add `tenant:<tenant>` tags when provided
- Determine `maxClassification` based on roles and `stepUp` status
- Never invent roles or tenants not in claims

**Classification Logic**:

```typescript
// stepUp == true: Allow up to "confidential"
// HR roles (hr.admin, hr.viewer): Allow up to "confidential"
// Other sensitive roles without stepUp: Cap at "internal"
// No sensitive roles: Cap at "public"
```

**Example Transformations**:

```typescript
// Finance user
{"roles": ["finance.viewer"], "tenant": "acme", "stepUp": false}
→ {"allowTags": ["role:finance.viewer", "tenant:acme"], "maxClassification": "internal"}

// HR user
{"roles": ["hr.viewer"], "tenant": "acme", "stepUp": false}
→ {"allowTags": ["role:hr.viewer", "tenant:acme"], "maxClassification": "confidential"}
```

### 3. Retrieve Agent (`retrieve.agent.ts`)

**Purpose**: Secure document retrieval with strict tool usage

**CRITICAL CONSTRAINTS**:

- Make EXACTLY ONE call to `vectorQueryTool`
- NEVER modify `maxClassification` value
- NEVER try different classification levels
- NEVER generate fake documents or citations
- Return ONLY what the tool returns

**Mandatory Steps**:

1. Parse input JSON for 'question' and 'access' fields
2. Call `vectorQueryTool` EXACTLY ONCE with exact parameters
3. Return tool output without modification

**Strictly Forbidden**:

- Multiple tool calls with different parameters
- Changing `maxClassification` from confidential to internal/public
- Adding explanatory text about findings
- Using external knowledge

### 4. Rerank Agent (`rerank.agent.ts`)

**Purpose**: Order retrieved contexts by relevance

**Key Patterns**:

```typescript
instructions: `You are a context reranking agent. Your task is to:
1. Analyze the relevance of each context to the question
2. Sort contexts from most to least relevant
3. Preserve all context properties exactly as provided
4. Return the complete reordered array

IMPORTANT: Return ALL contexts, just reordered. Do not filter or remove any.`
```

**Relevance Criteria**:

- Direct answer to question (highest priority)
- Related information providing context
- Background information (lower priority)
- Tangentially related content (lowest priority)

**Output Format**:

```json
{
    "contexts": [
        /* array of reordered context objects */
    ]
}
```

### 5. Answerer Agent (`answerer.agent.ts`)

**Purpose**: Generate answers ONLY from authorized contexts

**STRICT SECURITY RULES**:

- NEVER use external knowledge - ONLY provided contexts
- FIRST check if contexts address the specific question
- Perform critical relevance checks before answering
- Every factual statement must include citations

**Response Patterns**:

```typescript
// No contexts provided
"No authorized documents found that contain information about this topic."

// Contexts don't address question
"The authorized documents don't contain information about this specific topic."

// Valid answer with citations
{
  "answer": "The finance policy states that expense reports must be submitted within 30 days [finance-policy-001].",
  "citations": [{"docId": "finance-policy-001", "source": "Finance Department Policy Manual"}]
}
```

**Critical Relevance Check**:

- Verify context discusses EXACT topic asked
- Don't extrapolate or infer unstated information
- If context mentions related but different topics, DON'T answer

**Anti-Pattern Example**:

```typescript
// WRONG
Question: 'What are Termination Procedures?'
Context: 'Service termination fee is $50'
Answer: 'Termination procedures include paying a $50 fee'

// CORRECT
Answer: "The authorized documents don't contain information about this specific topic."
```

### 6. Verifier Agent (`verifier.agent.ts`)

**Purpose**: Final security verification of answers

**Verification Rules**:

- Every claim must be supported by provided contexts
- Citations must match actual document IDs
- No hallucinated or external information allowed
- Answer must be relevant to original question
- Context relevance check for topic drift

**Special Validation for Topic Drift**:

- Question about "Termination Procedures" but context only mentions "service termination fees" = NOT relevant
- Question about "Employee Benefits" but context only mentions "benefit eligibility" = might not be sufficient
- If context doesn't directly address question topic, answer should state no relevant information found

**Valid Responses That Should PASS**:

- "No authorized documents found that contain information about this topic."
- "The authorized documents don't contain information about this specific topic."
- Actual answers with proper citations where context directly addresses question

**Output Format**:

```json
{
  "ok": true/false,
  "reason": "verification result reason",
  "answer": "the verified answer or failure explanation"
}
```

## Agent Development Best Practices

### Instructions Writing

- **Be Explicit**: Clear, unambiguous instructions
- **Security First**: Always include security constraints
- **Format Specification**: Exact JSON structure required
- **Error Handling**: Define behavior for edge cases
- **Examples**: Include both correct and incorrect examples

### Tool Integration

- **Single Responsibility**: Each tool should have one clear purpose
- **Error Handling**: Proper try-catch with specific error messages
- **Validation**: Use Zod schemas for input/output validation
- **Logging**: Comprehensive logging for debugging and audit

### Schema Usage

```typescript
// Always export output schemas for agents that need structured responses
export const rerankOutputSchema = z.object({
    contexts: z.array(documentContextSchema),
})

// Use experimental_output for structured responses
const result = await agent.generate(input, {
    experimental_output: outputSchema,
})
```

### Security Considerations

- **Input Validation**: All inputs validated before processing
- **Output Sanitization**: No sensitive information in error messages
- **Audit Logging**: All agent activities logged with context
- **Access Control**: Respect role hierarchy and permissions
- **Context Isolation**: Never mix contexts from different security levels

### Performance Optimization

- **Efficient Instructions**: Clear, concise instructions reduce token usage
- **Structured Output**: Use schemas to reduce parsing overhead
- **Error Recovery**: Graceful handling of tool failures
- **Timeout Handling**: Proper timeout configuration for LLM calls

### Testing Strategies

- **Unit Tests**: Test individual agent logic
- **Integration Tests**: Test agent interactions in pipeline
- **Security Tests**: Verify access control enforcement
- **Edge Case Tests**: Test with invalid inputs and edge conditions

### Common Anti-Patterns to Avoid

#### ❌ External Knowledge Usage

```typescript
// WRONG - Using external knowledge
if (contexts.length === 0) {
    return 'Based on general knowledge about finance policies...'
}
```

#### ❌ Tool Misuse

```typescript
// WRONG - Multiple tool calls or parameter modification
await vectorQueryTool({ ...params, maxClassification: 'public' })
await vectorQueryTool({ ...params, maxClassification: 'internal' })
```

#### ❌ Inadequate Error Handling

```typescript
// WRONG - Generic error handling
catch (error) {
  throw error;
}

// CORRECT - Specific error handling
catch (error) {
  if (error instanceof Error) {
    throw new Error(`JWT verification failed: ${error.message}`);
  }
  throw new Error("JWT verification failed: Unknown error");
}
```

#### ❌ Schema Violations

```typescript
// WRONG - Not following required output format
return 'The answer is...'

// CORRECT - Following schema
return {
    answer: 'The answer is...',
    citations: [{ docId: 'doc-001', source: 'Source Name' }],
}
```
