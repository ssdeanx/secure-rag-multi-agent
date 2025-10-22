import { MastraClient } from '@mastra/client-js';

// Initialize the Mastra client
const A2Aclient = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL ?? 'http://localhost:4111',
});

/**
 * Example of using the A2A protocol to interact with agents
 */
async function main() {
  try {
    // Get the agent ID - this would be the ID of an agent you've created
    const agentId = 'myAgent';

    console.log(`🤖 Connecting to agent: ${agentId} via A2A protocol\n`);

    // Get the A2A client for the agent
    const a2aClient = A2Aclient.getA2A(agentId);

    // Step 1: Get the agent card to see its capabilities
    console.log('📋 Fetching agent card...');
    const agentCard = await a2aClient.getCard();

    console.log(`\nAgent Name: ${agentCard.name}`);
    console.log(`Description: ${agentCard.description}`);
    console.log(`Capabilities: ${JSON.stringify(agentCard.capabilities)}`);
    console.log(`API Version: ${agentCard.version}`);
    console.log('\n-------------------\n');

    // Step 2: Send a message to the agent
    const messageId = `message-${Date.now()}`;
    console.log(`📤 Sending message to agent (Message ID: ${messageId})...`);

    const query = 'What are the latest developments in AI agent networks?';
    console.log(`Query: ${query}`);

    const response = await a2aClient.sendMessage({
      message: {
        role: 'user',
        parts: [{ kind: 'text', text: query }],
        kind: 'message',
        messageId,
      },
    });

    console.log(response);
    if ('error' in response) {
      throw new Error(response.error.message);
    } else if ('messageId' in response.result) {
      // Mastra's current A2A implementation will always return a task, rather than a message
      return;
    }

    console.log(`\nTask Status: ${response.result.status.state}`);
    console.log('\n🤖 Agent Response:');
    console.log(
      response.result.status.message?.parts[0].kind === 'text'
        ? response.result.status.message?.parts[0].text
        : 'No response content',
    );

    console.log('\n-------------------\n');

    // Step 3: Get task status
    const taskId = response.result.id;
    console.log(`📥 Checking task status (Task ID: ${taskId})...`);

    const taskStatus = await a2aClient.getTask({
      id: taskId,
    });
    if ('error' in taskStatus) {
      console.log(taskStatus);
      throw new Error(taskStatus.error.message);
    }

    console.log(`Task Status: ${taskStatus.result.status.state}`);
    console.log('\n-------------------\n');

    // Step 4: Demonstrate agent-to-agent communication
    console.log('🔄 Demonstrating agent-to-agent communication...');

    // Get another agent for A2A communication
    const secondAgentId = 'contentCreatorAgent';
    console.log(`Connecting to second agent: ${secondAgentId}`);

    const secondA2aClient = A2Aclient.getA2A(secondAgentId);

    // First agent gathers information
    const researchTaskId = `research-${Date.now()}`;
    console.log(`\nStep 1: First agent (${agentId}) researches the topic...`);

    const researchQuery = 'Provide a brief summary of agent networks in AI';
    const researchResponse = await a2aClient.sendMessage({
      message: {
        role: 'user',
        parts: [{ kind: 'text', text: researchQuery }],
        kind: 'message',
        messageId: researchTaskId,
      },
    });
    if ('error' in researchResponse) {
      throw new Error(researchResponse.error.message);
    } else if ('messageId' in researchResponse.result) {
      // Mastra's current A2A implementation will always return a task, rather than a message
      return;
    }

    const researchResult =
      researchResponse.result.status.message?.parts?.[0]?.kind === 'text'
        ? researchResponse.result.status.message.parts?.[0]?.text
        : '';
    console.log('\nResearch Results:');
    console.log(researchResult.substring(0, 150) + '...');

    // Second agent transforms the research into content
    const contentTaskId = `content-${Date.now()}`;
    console.log(`\nStep 2: Second agent (${secondAgentId}) transforms research into content...`);

    const contentPrompt = `Transform this research into an engaging blog post introduction:\n\n${researchResult}`;
    const contentResponse = await secondA2aClient.sendMessage({
      message: {
        role: 'user',
        parts: [{ kind: 'text', text: contentPrompt }],
        kind: 'message',
        messageId: contentTaskId,
      },
    });
    if ('error' in contentResponse) {
      throw new Error(contentResponse.error.message);
    } else if ('messageId' in contentResponse.result) {
      // Mastra's current A2A implementation will always return a task, rather than a message
      return;
    }

    console.log('\nFinal Content:');
    console.log(
      contentResponse.result.status.message?.parts[0]?.kind === 'text'
        ? contentResponse.result.status.message.parts[0].text
        : 'No content generated',
    );

    console.log('\n-------------------\n');
    console.log('✅ A2A example completed successfully!');
  } catch (error) {
    console.error('❌ Error in A2A example:', error);
  }
}

// Run the example
main();
