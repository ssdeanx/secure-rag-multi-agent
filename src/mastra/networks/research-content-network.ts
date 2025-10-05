/**
 * Research and Content Generation Network
 *
 * This network demonstrates Mastra vNext AgentNetwork capabilities for orchestrating
 * multiple specialized agents and workflows to handle complex tasks.
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between agents and workflows
 * - Single task execution with .generate() for simple, one-off tasks
 * - Complex task execution with .loop() for multi-step reasoning
 * - Memory-backed task history and decision making
 *
 * Use Cases:
 * - Research a topic and generate comprehensive content
 * - Extract learnings from research and compile reports
 * - Iterative content creation with evaluation and refinement
 */

import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { researchAgent } from '../agents/researchAgent';
import { learningExtractionAgent } from '../agents/learningExtractionAgent';
import { copywriterAgent } from '../agents/copywriterAgent';
import { editorAgent } from '../agents/editorAgent';
import { evaluationAgent } from '../agents/evaluationAgent';
import { reportAgent } from '../agents/reportAgent';
import { researchWorkflow } from '../workflows/researchWorkflow';
import { generateReportWorkflow } from '../workflows/generateReportWorkflow';
import { contentGenerationWorkflow } from '../workflows/contentGenerationWorkflow';
import { pgMemory } from "../config/pg-storage";
/**
 * Research and Content Network Agent
 *
 * A multi-agent network for comprehensive research and content generation.
 * Uses the new agent.network() API for orchestrating multiple specialized
 * agents and workflows to handle complex tasks.
 *
 * Key Features:
 * - Non-deterministic LLM-based routing between agents and workflows
 * - Single task execution with .network() for simple, one-off tasks
 * - Complex task execution with multi-step reasoning
 * - Memory-backed task history and decision making
 *
 * Use Cases:
 * - Research a topic and generate comprehensive content
 * - Extract learnings from research and compile reports
 * - Iterative content creation with evaluation and refinement
 */

export const researchContentNetwork = new Agent({
  id: 'research-content-network',
  name: 'Research Content Network',
  instructions: `
    A multi-agent network for comprehensive research and content generation.

    Capabilities:
    - Conduct in-depth research on any topic
    - Extract key insights and learnings
    - Generate high-quality content (blog posts, articles, technical docs)
    - Refine and evaluate content quality
    - Compile structured reports with citations

    Use this network when you need to:
    - Research a topic and create content about it
    - Generate comprehensive reports with multiple sources
    - Iteratively improve content quality through evaluation
    - Extract patterns and insights from complex information
  `,
  model: google('gemini-2.5-flash-preview-09-2025'),

  // Specialized agents for different tasks
  agents: {
    research: researchAgent,
    learning: learningExtractionAgent,
    copywriter: copywriterAgent,
    editor: editorAgent,
    evaluation: evaluationAgent,
    report: reportAgent,
  },

  // Workflows for complex, multi-step processes
  workflows: {
    'research-workflow': researchWorkflow,
    'generate-report': generateReportWorkflow,
    'content-generation': contentGenerationWorkflow,
  },

  // Memory is REQUIRED for .network() method
  // It stores task history and enables decision-making
  memory: pgMemory,
});

/**
 * Example Usage:
 *
 * 1. Single Task Execution (Simple, one-off tasks)
 *
 * ```typescript
 * const network = researchContentNetwork;
 *
 * // Simple research query
 * const result = await network.network('Research the latest developments in AI agent orchestration');
 *
 * // Stream the response
 * const stream = await network.network('Create a blog post about RAG security best practices');
 * for await (const chunk of stream) {
 *   console.log(chunk);
 * }
 * ```
 *
 * 2. Complex Task Execution (Multi-step with reasoning)
 *
 * ```typescript
 * // Complex tasks are automatically broken down and executed by the most appropriate agents/workflows
 * const result = await network.network(`
 *   Research the top 3 AI agent frameworks. For each framework, analyze their
 *   architecture, key features, and use cases. Then synthesize this information
 *   into a comprehensive comparison report with recommendations.
 * `);
 * ```
 *
 * 3. Client-Side Usage
 *
 * ```typescript
 * import { MastraClient } from '@mastra/client-js';
 *
 * const client = new MastraClient();
 * const network = client.getAgent('research-content-network');
 *
 * // Generate response
 * const result = await network.network('What are the key considerations for RAG security?');
 *
 * // Stream response
 * const stream = await network.network('Create technical documentation for implementing RBAC in RAG');
 * for await (const chunk of stream) {
 *   console.log(chunk);
 * }
 * ```
 */

/**
 * Network Behavior:
 *
 * 1. Routing Decision:
 *    - The network's routing agent selects primitives based on descriptions
 *    - Better descriptions → better routing decisions
 *    - Workflow input schemas help determine appropriate inputs
 *
 * 2. Task Decomposition:
 *    - Complex tasks are broken into individual sub-tasks
 *    - Each sub-task is executed by the most appropriate primitive
 *    - Task history is stored in memory for decision-making
 *
 * 3. Synthesis:
 *    - Can be handled by the routing agent automatically
 *    - Or forced to use specific agent by mentioning it in the task
 *    - Example: "Make sure to use the report agent for synthesis"
 *
 * 4. Overlapping Capabilities:
 *    - When multiple primitives can handle a task, most specific is selected
 *    - Workflow input schemas help determine the best match
 *    - Descriptive naming yields better results
 */

/**
 * Key Differences from Workflows:
 *
 * Workflows:
 * - Linear or branched sequences of steps
 * - Deterministic execution flow
 * - You define the exact path
 *
 * Agent Networks:
 * - Non-deterministic LLM-based orchestration
 * - Dynamic multi-agent collaboration and routing
 * - Network decides the execution path
 *
 * Use Workflows when:
 * - You know the exact steps needed
 * - You need predictable, repeatable execution
 * - The process is well-defined
 *
 * Use Networks when:
 * - Task requires reasoning about which steps to take
 * - Input is unstructured or open-ended
 * - Multiple agents need to collaborate dynamically
 * - You want the system to figure out the approach
 */
