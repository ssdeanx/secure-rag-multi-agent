---
title: Logger Configuration - Technical Documentation
component_path: `src/mastra/config/logger.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, logging, pino, file, documentation]
---

# Logger Configuration Documentation

Logging configuration and utility functions for structured logging across the Mastra application. Provides Pino-based logging with file output and specialized functions for workflow, step, tool, and agent activity logging.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide centralized logging configuration and utilities for the application.

- OVR-002: Scope includes Pino logger setup, file logging wrapper, and specialized logging functions for Mastra workflows and agents. It deliberately excludes application-specific business logic.

- OVR-003: Context: Used throughout Mastra workflows, agents, and services for consistent structured logging.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module with utility functions. Combines Pino for console/file logging with custom file wrapper.

- ARC-002: Dependencies:
    - `@mastra/loggers`: PinoLogger and FileTransport
    - `node:fs`, `node:path`: File system operations

- ARC-003: Interactions: Functions write to console via Pino and append to workflow.log file. No external services.

- ARC-004: Visual/behavioral decisions: Uses emojis in log messages for visual distinction. Structured JSON logging to files.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Logger Module"
        L[logger.ts] --> PL[PinoLogger]
        L --> LFW[logToFile]
        L --> LWS[logWorkflowStart]
        L --> LWE[logWorkflowEnd]
        L --> LSS[logStepStart]
        L --> LSE[logStepEnd]
        L --> LTE[logToolExecution]
        L --> LAA[logAgentActivity]
        L --> LE[logError]
        L --> LP[logProgress]
    end

    subgraph "Outputs"
        PL --> Console
        LFW --> workflow.log
    end

    classDiagram
        class Logger {
            +log: PinoLogger
            +logWorkflowStart(workflowId, input)
            +logWorkflowEnd(workflowId, output, duration)
            +logStepStart(stepId, input)
            +logStepEnd(stepId, output, duration)
            +logToolExecution(toolId, input, output?)
            +logAgentActivity(agentId, action, details)
            +logError(component, error, context?)
            +logProgress(message, progress, total)
        }
```

## 3. Interface Documentation

- INT-001: Exports logger instance and utility functions.

| Export             | Purpose                 | Parameters                             | Return Type  | Usage Notes              |
| ------------------ | ----------------------- | -------------------------------------- | ------------ | ------------------------ |
| `log`              | Pino logger instance    | none                                   | `PinoLogger` | Use for general logging  |
| `logWorkflowStart` | Log workflow start      | `workflowId: string, input: Record`    | `void`       | Logs to console and file |
| `logWorkflowEnd`   | Log workflow completion | `workflowId, output, duration: number` | `void`       | Includes duration        |
| `logStepStart`     | Log step start          | `stepId: string, input: Record`        | `void`       | For workflow steps       |
| `logStepEnd`       | Log step completion     | `stepId, output, duration`             | `void`       | Includes duration        |
| `logToolExecution` | Log tool usage          | `toolId, input, output?`               | `void`       | For Mastra tools         |
| `logAgentActivity` | Log agent actions       | `agentId, action, details`             | `void`       | For agent activities     |
| `logError`         | Log errors              | `component, error, context?`           | `void`       | Structured error logging |
| `logProgress`      | Log progress            | `message, progress, total`             | `void`       | With percentage          |

## 4. Implementation Details

- IMP-001: Creates logs directory if missing. Pino configured for info level.
- IMP-002: File logging appends JSON entries to workflow.log.
- IMP-003: All functions log to both Pino (console) and file.
- IMP-004: Error logging extracts message and stack from Error objects.

Corner cases and considerations:

- File logging is synchronous (appendFileSync) for simplicity.
- Pino file transport is commented out in favor of custom wrapper.
- Directory creation is recursive and safe.

## 5. Usage Examples

### Basic logging

```ts
import { log } from '@/src/mastra/config/logger'

log.info('Application started')
log.error('Something went wrong', { error: 'details' })
```

### Workflow logging

```ts
import { logWorkflowStart, logWorkflowEnd } from '@/src/mastra/config/logger'

logWorkflowStart('rag-workflow', { question: 'What is AI?' })
// ... workflow execution ...
logWorkflowEnd('rag-workflow', { answer: '...' }, 1500)
```

### Step logging

```ts
import { logStepStart, logStepEnd } from '@/src/mastra/config/logger';

logStepStart('retrieval-step', { query: 'test' });
// ... step logic ...
logStepEnd('retrieval-step', { results: [...] }, 500);
```

### Error logging

```ts
import { logError } from '@/src/mastra/config/logger'

try {
    // risky operation
} catch (error) {
    logError('VectorService', error, { userId: '123' })
}
```

## 6. Quality Attributes

- QUA-001 Security: Logs may contain sensitive data; ensure proper log rotation and access controls.
- QUA-002 Performance: File logging is synchronous; may impact performance under high load.
- QUA-003 Reliability: Directory creation handles missing paths. Error logging is defensive.
- QUA-004 Maintainability: Centralized logging functions prevent duplication.
- QUA-005 Extensibility: Add new logging functions following the pattern.

## 7. Reference Information

- REF-001: Dependencies (approximate):
    - @mastra/loggers (^1.0.0)
    - node:fs, node:path (built-in)

- REF-002: Configuration
    - Log level set to 'info'; modify in Pino config.
    - Log directory: 'logs' relative to cwd.

- REF-003: Testing guidelines
    - Mock fs operations for file logging tests.
    - Test structured output format.

- REF-004: Troubleshooting
    - Issue: No logs appear — check directory permissions.
    - Issue: File logging fails — verify logs directory exists.

- REF-005: Related docs
    - Mastra workflow and agent documentation

- REF-006: Change history
    - 1.0 (2025-09-23) - Initial documentation generated
