# Memory Bank

This directory contains the Memory Bank documentation system - a hierarchical structure designed to survive AI memory resets and maintain project continuity.

## Quick Start

### For AI Agents (READ THIS FIRST)

When starting any task, read files in this order:

1. **projectbrief.md** - Project goals and scope
2. **activeContext.md** - Current work focus
3. **progress.md** - What works and what doesn't
4. **systemPatterns.md** - Architecture and patterns (if technical work)
5. **techContext.md** - Technology stack (if technical work)

Then check:

- **tasks/_index.md** - See what's active
- Specific task files for work in progress
- Related design and requirement docs

### For Developers

This memory bank follows the spec-driven development approach:

```
Designs (Architecture) → Requirements (Specs) → Tasks (Implementation)
```

Browse the index files to see what exists:

- `designs/_index.md` - Technical designs
- `requirements/_index.md` - Formal requirements (EARS format)
- `tasks/_index.md` - Implementation tasks

## Structure

```
memory-bank/
├── README.md (this file)
├── projectbrief.md (foundation document)
├── productContext.md (why and how)
├── systemPatterns.md (architecture)
├── techContext.md (technology)
├── activeContext.md (current state)
├── progress.md (status and lessons)
├── designs/
│   ├── _index.md
│   └── [DESIGN###]-name.md
├── requirements/
│   ├── _index.md
│   └── [REQ###]-name.md
└── tasks/
    ├── _index.md
    └── [TASK###]-name.md
```

## Core Files

| File | Purpose | Read When |
|------|---------|-----------|
| projectbrief.md | Project goals, scope, constraints | Starting any work |
| productContext.md | User experience, personas, features | Understanding requirements |
| systemPatterns.md | Architecture, design decisions | Technical implementation |
| techContext.md | Technology stack, setup, tools | Development setup |
| activeContext.md | Current focus, recent changes | Every task |
| progress.md | Status, lessons learned, roadmap | Planning work |

## Using the Memory Bank

### Creating a New Task

```bash
# Command: create task [description]
```

1. AI creates new task file: `tasks/[TASK###]-name.md`
2. Updates `tasks/_index.md`
3. Links to relevant requirements and designs
4. Documents thought process and implementation plan

### Updating Progress

```bash
# Command: update task [TASK###]
```

1. AI opens specific task file
2. Updates subtask status table
3. Adds progress log entry with date/time
4. Updates `tasks/_index.md` if status changes

### Viewing Tasks

```bash
# Command: show tasks [filter]
```

Filters: `all`, `active`, `pending`, `completed`, `blocked`, `recent`

### Creating Designs/Requirements

Follow the templates in the respective `_index.md` files.

## Design Philosophy

### Hierarchical Structure

Files build on each other in a clear dependency chain:

```
projectbrief.md
    ↓
productContext.md, systemPatterns.md, techContext.md
    ↓
activeContext.md
    ↓
designs/ → requirements/ → tasks/
    ↓
progress.md
```

### Progressive Disclosure

Start with high-level concepts, drill down as needed. You don't need to read everything for every task.

### Spec-Driven Development

1. **Design Phase**: Create technical specification
2. **Requirements Phase**: Define testable criteria (EARS format)
3. **Task Creation**: Implementation plan with subtasks
4. **Implementation**: Follow task plan
5. **Validation**: Verify against requirements

### Traceability

Every artifact links to related artifacts:

- Designs reference requirements
- Requirements reference designs and tasks
- Tasks reference requirements and designs

## EARS Format (Requirements)

Requirements use Easy Approach to Requirements Syntax:

- **Ubiquitous**: THE SYSTEM SHALL [behavior]
- **Event-driven**: WHEN [trigger] THE SYSTEM SHALL [behavior]
- **State-driven**: WHILE [state] THE SYSTEM SHALL [behavior]
- **Unwanted**: IF [condition] THEN THE SYSTEM SHALL [response]
- **Optional**: WHERE [feature] THE SYSTEM SHALL [behavior]

## Maintenance

### When to Update

1. **activeContext.md**: When focus areas change
2. **progress.md**: After completing tasks, learning lessons
3. **Task files**: During active work (both table and log)
4. **Index files**: When adding/completing tasks, designs, requirements

### Best Practices

- Update both subtask table AND progress log in task files
- Add dates and timestamps to all updates
- Keep cross-references current
- Document decisions and reasoning, not just facts
- Think about future AI reading these files

## Status

**Created:** 2025-09-30  
**Status:** ✅ Operational

The memory bank is now ready for use. Next steps:

1. Validate workflow with a real task
2. Begin backfilling design documents
3. Create formal requirements for implemented features
4. Refine based on experience

## Need Help?

- Check `.github/instructions/memory-bank.instructions.md` for full specification
- Review `activeContext.md` for current state
- Look at `tasks/[TASK001]-initialize-memory-bank.md` as an example
- All files have templates in the respective `_index.md` files
