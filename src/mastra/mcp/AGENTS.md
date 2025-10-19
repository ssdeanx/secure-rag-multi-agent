# A2A Coordinator MCP Server

This MCP server exposes the A2A (Agent-to-Agent) Coordinator functionality, allowing external MCP clients to coordinate complex tasks across multiple specialized agents.

## Available Tools

### `coordinate_a2a_task`
Coordinate complex tasks across multiple specialized agents using the A2A protocol.

**Parameters:**

- `task` (string): The complex task to coordinate across agents
- `taskType` (enum): Type of task - "financial", "content", "rag", "report", "coordination"
- `workflow` (enum): How to orchestrate - "sequential", "parallel", "conditional"
- `priority` (enum): Task priority - "low", "medium", "high", "urgent"

### `list_a2a_agents`
Get a list of all available agents that can be coordinated.

**Returns:** Array of agents with their names and descriptions.

### `create_a2a_workflow`
Create a custom workflow for multi-agent coordination.

**Parameters:**

- `workflowName` (string): Name for the custom workflow
- `agents` (array): List of agent names to include
- `workflowType` (enum): How agents work together
- `description` (string, optional): Workflow description

### `ask_a2aCoordinator`
Direct access to the A2A coordinator agent for complex coordination tasks.

## Starting the Server

```bash
npm run mcp-server
```

This starts the MCP server with stdio transport, ready to be used by MCP clients like Cursor, Windsurf, or Claude Desktop.

## Integration

The MCP server is automatically registered with Mastra and can be accessed through the main Mastra configuration. It provides both direct tool access and agent-based coordination capabilities.