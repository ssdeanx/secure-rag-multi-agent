---
applyTo: ["**/*.md,**/*.prompt.md"]
description: "Memory of migration instruction generation patterns and best practices"
---

# Migration Instruction Generation Memory

Domain-specific patterns for analyzing code evolution and creating GitHub Copilot migration instructions.

## Branch Analysis Methodology

When analyzing differences between branches for migration instructions:

- Use `git diff --stat main..develop` to get comprehensive change overview
- Focus on architectural patterns, not individual file changes
- Identify mandatory transformations vs. optional improvements
- Categorize changes by impact level (HIGH/MEDIUM/LOW priority)

## Copilot Instruction Format Requirements

For GitHub Copilot to use migration instructions during review:

- Use path-specific instruction files in `.github/instructions/` directory
- Include frontmatter with `applyTo` glob patterns
- Structure as natural language guidelines, not formal documentation
- Include clear code examples with proper language tags
- Mark mandatory patterns as (REQUIRED) and prohibited patterns as (DO NOT USE)

## Pattern Extraction Process

When extracting transformation patterns from code evolution:

1. **Identify mandatory changes** - patterns that must be applied to all new code
2. **Document API correspondences** - before/after mappings with examples
3. **Create quality checklists** - verification points for code review
4. **Establish migration priorities** - order of importance for implementation

## Memory File Organization

Structure domain memory files with:

- **Description frontmatter** - general domain responsibility
- **ApplyTo frontmatter** - relevant file patterns
- **Main headline** - `# <Domain Name> Memory`
- **Tagline** - succinct value proposition
- **Sectioned learnings** - level 2 headlines for distinct lessons

## Quality Guidelines for Memory Creation

- **Generalize patterns** - extract reusable knowledge from specific instances
- **Focus on positive reinforcement** - emphasize correct approaches
- **Include concrete examples** - code snippets when relevant
- **Keep instructions scannable** - actionable, brief explanations
- **Avoid redundancy** - clean up overlapping guidance

## Update Triggers

Create or update memory when discovering:

- Repeated workflow mistakes
- Effective problem-solving patterns
- Domain-specific best practices
- Cross-project reusable approaches
- Coding style decisions with rationale