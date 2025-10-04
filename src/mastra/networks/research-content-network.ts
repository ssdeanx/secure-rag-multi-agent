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

import { NewAgentNetwork } from '@mastra/core/network/vNext';
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
import { createResearchMemory } from '../config/libsql-storage';

/**
 * Research and Content Network
 * 
 * Primitives (Agents & Workflows):
 * - researchAgent: Conducts research on topics with web search and analysis
 * - learningExtractionAgent: Extracts key insights and patterns from research
 * - copywriterAgent: Creates initial content drafts
 * - editorAgent: Refines and improves content quality
 * - evaluationAgent: Assesses content quality with metrics
 * - reportAgent: Compiles findings into structured reports
 * - researchWorkflow: Multi-step research with human-in-loop
 * - generateReportWorkflow: Automated report generation
 * - contentGenerationWorkflow: 5-step content pipeline
 * 
 * The network uses these primitives based on:
 * - Agent/workflow descriptions (better descriptions = better routing)
 * - Workflow input schemas (used to determine inputs)
 * - Task specificity (most specific primitive is selected)
 */
export const researchContentNetwork = new NewAgentNetwork({
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
  
  // Memory is REQUIRED for .loop() method
  // It stores task history and enables decision-making
  memory: createResearchMemory(),
});

/**
 * Example Usage:
 * 
 * 1. Single Task Execution (Simple, one-off tasks)
 * 
 * ```typescript
 * const network = mastra.vnext_getNetwork('research-content-network');
 * 
 * // Simple research query
 * const result = await network.generate(
 *   'Research the latest developments in AI agent orchestration',
 *   { runtimeContext }
 * );
 * 
 * // Stream the response
 * const stream = await network.stream(
 *   'Create a blog post about RAG security best practices',
 *   { runtimeContext }
 * );
 * 
 * for await (const chunk of stream) {
 *   console.log(chunk);
 * }
 * ```
 * 
 * 2. Complex Task Execution (Multi-step with reasoning)
 * 
 * ```typescript
 * // The loop() method breaks down complex tasks and executes primitives iteratively
 * const result = await network.loop(
 *   `Research the top 3 AI agent frameworks. For each framework, analyze their 
 *    architecture, key features, and use cases. Then synthesize this information 
 *    into a comprehensive comparison report with recommendations. Make sure to 
 *    use the learning agent to extract patterns and the report agent for synthesis.`,
 *   { runtimeContext }
 * );
 * ```
 * 
 * 3. Client-Side Usage
 * 
 * ```typescript
 * import { MastraClient } from '@mastra/client-js';
 * 
 * const client = new MastraClient();
 * const network = client.getVNextNetwork('research-content-network');
 * 
 * // Generate response
 * const result = await network.generate(
 *   'What are the key considerations for RAG security?',
 *   { runtimeContext }
 * );
 * 
 * // Stream response
 * const stream = await network.stream(
 *   'Create technical documentation for implementing RBAC in RAG',
 *   { runtimeContext }
 * );
 * 
 * // Complex loop
 * const loopResult = await network.loop(
 *   'Research and write about enterprise AI security patterns',
 *   { runtimeContext }
 * );
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
 * 2. Task Decomposition (loop method):
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
