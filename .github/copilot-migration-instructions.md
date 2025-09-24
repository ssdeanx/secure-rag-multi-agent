# GitHub Copilot Migration Instructions

## Migration Context

- **Type**: Architecture Refactoring
- **From**: main
- **To**: develop
- **Date**: 2025-09-24
- **Scope**: Entire project

## Automatic Transformation Rules

### 1. Mandatory Transformations

#### Agent Development Pattern

**Old Pattern**: Simple agent definitions
**New Pattern**: Kilocode-compliant agents with structured headers
**Trigger**: When creating new agents in `src/mastra/agents/`
**Action**: Add Kilocode header with owner, category, approval requirements, tools, schemas, and caller claims

```typescript
// BEFORE (main)
export const myAgent = new Agent({
  id: "my-agent",
  name: "My Agent",
  // ... basic config
});

// AFTER (develop)
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// inputSchema: src/mastra/schemas/agent-schemas.ts::Input
// outputSchema: src/mastra/schemas/agent-schemas.ts::MyOutput
// requiredCallerClaims:
//  - roles: [role:engineering]
//  - tenant: engineering
// approvedBy: samm
// approvalDate: 9/24

import { Agent } from "@mastra/core/agent";
import { createResearchMemory } from '../config/libsql-storage';

export const myAgent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: `
<role>
You are a [Role Description].
</role>

<persona>
- **[Trait]:** [Description]
</persona>

<process>
When given a task, you must follow this process:
1. **[Step 1]**
2. **[Step 2]**
</process>
  `,
  memory: createResearchMemory(),
  // ... enhanced config with evals, processors, tools
});
```

#### Workflow Logging Pattern

**Old Pattern**: Basic workflow steps
**New Pattern**: Structured logging with step tracking
**Trigger**: When creating workflow steps
**Action**: Add logStepStart/logStepEnd/logError pattern

```typescript
// BEFORE (main)
const workflowStep = createStep({
  execute: async ({ inputData }) => {
    // implementation
    return result;
  }
});

// AFTER (develop)
const workflowStep = createStep({
  id: 'step-name',
  inputSchema: z.object({...}),
  outputSchema: z.object({...}),
  execute: async ({ inputData }) => {
    logStepStart('step-name', inputData);
    try {
      // Implementation
      logStepEnd('step-name', result, duration);
      return result;
    } catch (error) {
      logError('step-name', error, inputData);
      throw error;
    }
  }
});
```

#### Component Architecture Pattern

**Old Pattern**: Basic React components
**New Pattern**: Cedar 3D container components
**Trigger**: When creating new UI components in `cedar/components/`
**Action**: Use Container3D, FloatingContainer, and structural patterns

```tsx
// BEFORE (main)
const MyComponent = () => {
  return <div>Content</div>;
};

// AFTER (develop)
import Container3D from '@/cedar/components/containers/Container3D';
import { FloatingContainer } from '@/cedar/components/structural/FloatingContainer';

const MyComponent: React.FC<MyComponentProps> = ({ className = '' }) => {
  return (
    <Container3D className={className}>
      <FloatingContainer>
        Content
      </FloatingContainer>
    </Container3D>
  );
};
```

### 2. Transformations with Validation

#### Documentation Structure

**Detected Pattern**: Component documentation
**Suggested Transformation**: Structured markdown with frontmatter and mermaid diagrams
**Required Validation**: Must include OVR, ARC, STR sections with proper numbering
**Alternatives**: Use existing documentation templates

#### Configuration Enhancement

**Detected Pattern**: Basic configuration files
**Suggested Transformation**: Comprehensive configs with proper typing and error handling
**Required Validation**: Must include interface definitions and zod schemas
**Alternatives**: Extend existing config patterns

### 3. API Correspondences

| Old API | New API | Notes | Example |
| ------- | ------- | ----- | ------- |
| Basic Agent | Kilocode Agent | Added approval workflow | See assistant.ts |
| Simple Workflow | Logged Workflow | Added tracing and error handling | See chatWorkflow.ts |
| Basic Component | Cedar Component | Added 3D styling and structure | See CedarCaptionChat.tsx |
| Simple Config | Enhanced Config | Added comprehensive typing | See libsql-storage.ts |

### 4. New Patterns to Adopt

#### AGENTS.md Files

**Pattern**: Directory documentation
**Usage**: Create AGENTS.md in every source directory
**Implementation**: Document purpose, components, and relationships
**Benefits**: Improved code discoverability and maintenance

#### Structured Instructions Format

**Pattern**: Role/Persona/Process format for agents
**Usage**: All new agents must follow this structure
**Implementation**: Use XML-like tags for clear sections
**Benefits**: Consistent agent behavior and debugging

#### Memory Integration

**Pattern**: Research memory for agent persistence
**Usage**: Use createResearchMemory() in agents
**Implementation**: Import and configure memory storage
**Benefits**: Persistent context across agent executions

### 5. Obsolete Patterns to Avoid

#### Simple Agent Definitions

**Obsolete Pattern**: Basic agent creation without Kilocode headers
**Why Avoid**: Missing approval workflow and documentation
**Alternative**: Use Kilocode-compliant agent template
**Migration**: Add headers and enhance configuration

#### Unlogged Workflow Steps

**Obsolete Pattern**: Workflow steps without structured logging
**Why Avoid**: Poor observability and debugging
**Alternative**: Add logStepStart/logStepEnd/logError
**Migration**: Wrap execution in try/catch with logging

#### Basic React Components

**Obsolete Pattern**: Standard div-based components
**Why Avoid**: Inconsistent with Cedar design system
**Alternative**: Use Container3D and FloatingContainer
**Migration**: Wrap content in cedar structural components

## File Type Specific Instructions

### Agent Files (`src/mastra/agents/*.ts`)

1. Add Kilocode header with approval metadata
2. Use structured instructions format
3. Include memory configuration
4. Add evaluation metrics
5. Configure input/output processors

### Workflow Files (`src/mastra/workflows/*.ts`)

1. Add comprehensive logging
2. Define input/output schemas
3. Include error handling
4. Add step timing metrics

### Component Files (`cedar/components/**/*.tsx`)

1. Use Container3D for layout
2. Implement proper TypeScript interfaces
3. Add keyboard shortcuts support
4. Include accessibility features

### Configuration Files (`src/mastra/config/*.ts`)

1. Add comprehensive type definitions
2. Include error handling
3. Add validation schemas
4. Include usage documentation

## Validation and Security

### Automatic Control Points

- Verify Kilocode headers on agent files
- Check for logStepStart/logStepEnd in workflows
- Validate Container3D usage in components
- Ensure AGENTS.md exists in directories

### Manual Escalation

Situations requiring human intervention:

- Security-related agent modifications
- Breaking API changes
- Architectural decisions
- Third-party service integrations

## Migration Monitoring

### Tracking Metrics

- Percentage of agents with Kilocode headers
- Number of workflows with proper logging
- Component migration completion rate
- Documentation coverage

### Error Reporting

How to report incorrect transformations:

- Flag missing Kilocode headers
- Report logging inconsistencies
- Document component styling issues
- Note configuration validation failures

## Contextual Examples

### Agent Transformation Example

```typescript
// BEFORE (main)
export const simpleAgent = new Agent({
  id: "simple",
  name: "Simple Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4"),
});
```

```typescript
// AFTER (develop)
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools: []
// inputSchema: src/mastra/schemas/agent-schemas.ts::Input
// outputSchema: src/mastra/schemas/agent-schemas.ts::SimpleOutput
// requiredCallerClaims:
//  - roles: [role:user]
// approvedBy: samm
// approvalDate: 9/24

import { Agent } from "@mastra/core/agent";
import { createResearchMemory } from '../config/libsql-storage';

export const simpleAgent = new Agent({
  id: "simple",
  name: "Simple Agent",
  instructions: `
<role>
You are a helpful assistant.
</role>

<persona>
- **Helpful & Accurate:** You provide clear, accurate responses.
</persona>

<process>
1. Understand the user's request
2. Provide a helpful response
</process>
  `,
  model: openai("gpt-4"),
  memory: createResearchMemory(),
});
```

**COPILOT INSTRUCTIONS:**
When you see a basic agent definition, transform it to include Kilocode header, structured instructions, and memory configuration following the pattern above.

### Workflow Transformation Example

```typescript
// BEFORE (main)
const basicStep = createStep({
  execute: async ({ input }) => {
    return { result: "done" };
  }
});
```

```typescript
// AFTER (develop)
const basicStep = createStep({
  id: 'basic-step',
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    result: z.string()
  }),
  execute: async ({ inputData }) => {
    logStepStart('basic-step', inputData);
    try {
      const result = { result: "done" };
      logStepEnd('basic-step', result, Date.now() - startTime);
      return result;
    } catch (error) {
      logError('basic-step', error, inputData);
      throw error;
    }
  }
});
```

**COPILOT INSTRUCTIONS:**
When creating workflow steps, always add logging, schemas, and error handling using the structured pattern.

#### Workflow Logging Pattern (Mandatory)

**Old Pattern**: Basic workflow steps
**New Pattern**: Structured logging with step tracking
**Trigger**: When creating workflow steps
**Action**: Add logStepStart/logStepEnd/logError pattern

```typescript
// BEFORE (main)
const workflowStep = createStep({
  execute: async ({ inputData }) => {
    // implementation
    return result;
  }
});

// AFTER (develop)
const workflowStep = createStep({
  id: 'step-name',
  inputSchema: z.object({...}),
  outputSchema: z.object({...}),
  execute: async ({ inputData }) => {
    logStepStart('step-name', inputData);
    try {
      // Implementation
      logStepEnd('step-name', result, duration);
      return result;
    } catch (error) {
      logError('step-name', error, inputData);
      throw error;
    }
  }
});
```

#### Component Architecture Pattern (Mandatory)

**Old Pattern**: Basic React components
**New Pattern**: Cedar 3D container components
**Trigger**: When creating new UI components in `cedar/components/`
**Action**: Use Container3D, FloatingContainer, and structural patterns

```tsx
// BEFORE (main)
const MyComponent = () => {
  return <div>Content</div>;
};

// AFTER (develop)
import Container3D from '@/cedar/components/containers/Container3D';
import { FloatingContainer } from '@/cedar/components/structural/FloatingContainer';

const MyComponent: React.FC<MyComponentProps> = ({ className = '' }) => {
  return (
    <Container3D className={className}>
      <FloatingContainer>
        Content
      </FloatingContainer>
    </Container3D>
  );
};
```

### 2. Conditional Transformations

#### Documentation Structure Enhancement

**Detected Pattern**: Component documentation
**Suggested Transformation**: Structured markdown with frontmatter and mermaid diagrams
**Required Validation**: Must include OVR, ARC, STR sections with proper numbering
**Alternatives**: Use existing documentation templates

#### Configuration Enhancement Pattern

**Detected Pattern**: Basic configuration files
**Suggested Transformation**: Comprehensive configs with proper typing and error handling
**Required Validation**: Must include interface definitions and zod schemas
**Alternatives**: Extend existing config patterns

### 3. API Correspondences Table

| Old API | New API | Notes | Example |
| ------- | ------- | ----- | ------- |
| Basic Agent | Kilocode Agent | Added approval workflow | See assistant.ts |
| Simple Workflow | Logged Workflow | Added tracing and error handling | See chatWorkflow.ts |
| Basic Component | Cedar Component | Added 3D styling and structure | See CedarCaptionChat.tsx |
| Simple Config | Enhanced Config | Added comprehensive typing | See libsql-storage.ts |

### 4. Recommended New Patterns

#### AGENTS.md Directory Documentation Pattern

**Pattern**: Directory documentation
**Usage**: Create AGENTS.md in every source directory
**Implementation**: Document purpose, components, and relationships
**Benefits**: Improved code discoverability and maintenance

#### Structured Agent Instructions Format Pattern

**Pattern**: Role/Persona/Process format for agents
**Usage**: All new agents must follow this structure
**Implementation**: Use XML-like tags for clear sections
**Benefits**: Consistent agent behavior and debugging

#### Memory Integration Pattern

**Pattern**: Research memory for agent persistence
**Usage**: Use createResearchMemory() in agents
**Implementation**: Import and configure memory storage
**Benefits**: Persistent context across agent executions

### 5. Patterns to Avoid

#### Avoid Simple Agent Definitions

**Obsolete Pattern**: Basic agent creation without Kilocode headers
**Why Avoid**: Missing approval workflow and documentation
**Alternative**: Use Kilocode-compliant agent template
**Migration**: Add headers and enhance configuration

#### Avoid Unlogged Workflow Steps

**Obsolete Pattern**: Workflow steps without structured logging
**Why Avoid**: Poor observability and debugging
**Alternative**: Add logStepStart/logStepEnd/logError
**Migration**: Wrap execution in try/catch with logging

#### Avoid Basic React Components

**Obsolete Pattern**: Standard div-based components
**Why Avoid**: Inconsistent with Cedar design system
**Alternative**: Use Container3D and FloatingContainer
**Migration**: Wrap content in cedar structural components

## File-Specific Development Guidelines

### Agent Files Development (`src/mastra/agents/*.ts`)

1. Add Kilocode header with approval metadata
2. Use structured instructions format
3. Include memory configuration
4. Add evaluation metrics
5. Configure input/output processors

### Workflow Files Development (`src/mastra/workflows/*.ts`)

1. Add comprehensive logging
2. Define input/output schemas
3. Include error handling
4. Add step timing metrics

### Component Files Development (`cedar/components/**/*.tsx`)

1. Use Container3D for layout
2. Implement proper TypeScript interfaces
3. Add keyboard shortcuts support
4. Include accessibility features

### Configuration Files Development (`src/mastra/config/*.ts`)

1. Add comprehensive type definitions
2. Include error handling
3. Add validation schemas
4. Include usage documentation

## Quality Assurance and Security

### Automated Validation Checks

- Verify Kilocode headers on agent files
- Check for logStepStart/logStepEnd in workflows
- Validate Container3D usage in components
- Ensure AGENTS.md exists in directories

### Manual Review Requirements

Situations requiring human intervention:

- Security-related agent modifications
- Breaking API changes
- Architectural decisions
- Third-party service integrations

## Progress Tracking and Monitoring

### Key Performance Metrics

- Percentage of agents with Kilocode headers
- Number of workflows with proper logging
- Component migration completion rate
- Documentation coverage

### Issue Reporting Guidelines

How to report incorrect transformations:

- Flag missing Kilocode headers
- Report logging inconsistencies
- Document component styling issues
- Note configuration validation failures

## Practical Transformation Examples

### Agent Enhancement Example

```typescript
// BEFORE (main)
export const simpleAgent = new Agent({
  id: "simple",
  name: "Simple Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4"),
});
```

```typescript
// AFTER (develop)
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools: []
// inputSchema: src/mastra/schemas/agent-schemas.ts::Input
// outputSchema: src/mastra/schemas/agent-schemas.ts::SimpleOutput
// requiredCallerClaims:
//  - roles: [role:user]
// approvedBy: samm
// approvalDate: 9/24

import { Agent } from "@mastra/core/agent";
import { createResearchMemory } from '../config/libsql-storage';

export const simpleAgent = new Agent({
  id: "simple",
  name: "Simple Agent",
  instructions: `
<role>
You are a helpful assistant.
</role>

<persona>
- **Helpful & Accurate:** You provide clear, accurate responses.
</persona>

<process>
1. Understand the user's request
2. Provide a helpful response
</process>
  `,
  model: openai("gpt-4"),
  memory: createResearchMemory(),
});
```

**COPILOT INSTRUCTIONS:**
When you see a basic agent definition, transform it to include Kilocode header, structured instructions, and memory configuration following the pattern above.

### Workflow Enhancement Example

```typescript
// BEFORE (main)
const basicStep = createStep({
  execute: async ({ input }) => {
    return { result: "done" };
  }
});
```

```typescript
// AFTER (develop)
const basicStep = createStep({
  id: 'basic-step',
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    result: z.string()
  }),
  execute: async ({ inputData }) => {
    logStepStart('basic-step', inputData);
    try {
      const result = { result: "done" };
      logStepEnd('basic-step', result, Date.now() - startTime);
      return result;
    } catch (error) {
      logError('basic-step', error, inputData);
      throw error;
    }
  }
});
```

**COPILOT INSTRUCTIONS:**
When creating workflow steps, always add logging, schemas, and error handling using the structured pattern.</content>
<parameter name="filePath">/home/sam/mastra-governed-rag/.github/copilot-migration-instructions.md