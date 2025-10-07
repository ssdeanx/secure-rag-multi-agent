---
title: LoggerConfig - Technical Documentation
component_path: `src/mastra/config/logger.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Logging / Backend
tags: [config, logger, pino, file, workflow]
---

# LoggerConfig Documentation

Pino-based logger configuration with file transport (mastra.log, workflow.log) and specialized functions for workflow/step/tool/agent/error/progress logging. Ensures structured, timestamped logs.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide centralized logging for Mastra with domain-specific helpers.

- OVR-002: Scope: PinoLogger init, dir creation, logToFile util, exports for workflow events. Excludes transport enable (commented).

- OVR-003: Context: Used across Mastra for tracing executions.

## 2. Architecture Section

- ARC-001: Design patterns: Logger factory with helpers.

- ARC-002: Dependencies:
    - @mastra/loggers (PinoLogger, FileTransport)

    - node:fs/path (dir/file)

- ARC-003: Interactions: log.info/error with data; file append JSON.

- ARC-004: Helpers: Specific for start/end/activity/error/progress with timestamp/message/data.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    LC[LoggerConfig] --> PL[PinoLogger {name: 'logger', level: 'info'}]
    LC --> FT[FileTransport (commented)]
    LC --> Dir[logs/ mkdir]

    subgraph "Helpers"
        LC --> LWS[logWorkflowStart/End]
        LC --> LSS[logStepStart/End]
        LC --> LTE[logToolExecution]
        LC --> LAA[logAgentActivity]
        LC --> LE[logError]
        LC --> LP[logProgress]
    end

    subgraph "File Logging"
        Helpers --> LTF[logToFile: JSON append to workflow.log]
    end

    subgraph "External"
        Pino[Pino] --> PL
        Node[fs/path] --> Dir
    end

    classDiagram
        class PinoLogger {
            +info(msg, data): void
            +error(msg, data): void
        }
        class LogHelpers {
            +logWorkflowStart(id, input): void
            +logError(component, error, context): void
        }

        LoggerConfig --> PinoLogger
        LoggerConfig --> LogHelpers
```

## 3. Interface Documentation

- INT-001: Exported log and helpers.

| Helper             | Purpose      | Parameters                    | Notes           |
| ------------------ | ------------ | ----------------------------- | --------------- |
| `logWorkflowStart` | Start log    | `id, input`                   | Info + file     |
| `logStepStart/End` | Step events  | `id, input/output, duration?` | With ms         |
| `logToolExecution` | Tool call    | `id, input, output?`          | Optional output |
| `logAgentActivity` | Agent action | `id, action, details`         | Structured      |
| `logError`         | Errors       | `component, error, context?`  | Stack if Error  |
| `logProgress`      | Progress     | `msg, progress, total`        | Percentage calc |

INT notes:

- INT-003: All append to file + console.

## 4. Implementation Details

- IMP-001: PinoLogger init; dir create if !exists.

- IMP-002: logToFile: Timestamp + msg + data JSON append.

- IMP-003: Helpers: log.info(msg, data) + file; duration/percentage computed.

- IMP-004: Transport: Commented file; use console.

Edge cases and considerations:

- No dir: mkdir recursive.

- Error logging: Stringify unknown.

## 5. Usage Examples

### Workflow Logging

```ts
logWorkflowStart('research', { query: 'AI' })
// Later
logWorkflowEnd('research', { data }, 5000)
```

### Error

```ts
logError('step', new Error('Fail'), { input })
```

Best practices:

- Use helpers for consistency.

- Include context for debugging.

## 6. Quality Attributes

- QUA-001 Security: No secrets in logs (mask if needed).

- QUA-002 Performance: Async file; low overhead.

- QUA-003 Reliability: Try-catch? No, but Pino handles.

- QUA-004 Maintainability: Domain helpers.

- QUA-005 Extensibility: Add helpers (e.g., logMetric).

## 7. Reference Information

- REF-001: Dependencies: @mastra/loggers, node:fs/path

- REF-002: Dir: logs/ in cwd.

- REF-003: Testing: Mock append; assert JSON.

- REF-004: Troubleshooting: No file — check permissions.

- REF-005: Related: Workflows using log\*

- REF-006: Change history: 1.0 (2025-09-23)
