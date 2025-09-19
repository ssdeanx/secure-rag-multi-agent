# Mastra Governed RAG: Mastra Guide

This document explains the core Mastra components used in this project.

## 1. Overview

Mastra is an AI orchestration framework that allows for the creation of complex, agent-based systems. In this project, it is used to build the secure RAG pipeline.

The key Mastra concepts used are:
- **Workflows:** The top-level orchestrators that define the sequence of operations.
- **Agents:** Specialized AI components that perform specific tasks (e.g., retrieving data, generating answers).
- **Tools:** Functions that agents can call to interact with external systems (e.g., a vector database).
- **Services:** Classes that encapsulate business logic or connections to external services.

All Mastra-related code is located in the `src/mastra/` directory.

## 2. Workflows

- **`governed-rag-answer.workflow.ts`**: This is the main workflow for handling user queries. It orchestrates the entire agent pipeline from authentication to generating a secure answer.
- **`governed-rag-index.workflow.ts`**: This workflow handles the indexing of documents from the `corpus/` directory into the Qdrant vector database.

## 3. Agents

The RAG pipeline is composed of several specialized agents found in `src/mastra/agents/`:

- **Identity Agent:** Validates the user's JWT to confirm their identity and roles.
- **Policy Agent:** Determines the user's data access permissions based on their roles and the configured policies.
- **Retrieve Agent:** Queries the Qdrant database for relevant document chunks, strictly applying the access filters provided by the Policy Agent.
- **Rerank Agent:** Re-scores the retrieved chunks for relevance to the user's specific question.
- **Answerer Agent:** Generates a final answer using the LLM. Its instructions strictly forbid it from using any information other than the context provided by the reranked chunks.
- **Verifier Agent:** Performs a final check on the generated answer to ensure it complies with all security and access policies before it is sent to the user.

## 4. Tools

Agents use tools to perform actions. Key tools are in `src/mastra/tools/`:

- **`vector-query.tool.ts`**: Allows the Retrieve Agent to perform a filtered search on the Qdrant vector database.
- **`jwt-auth.tool.ts`**: Allows the Identity Agent to validate a JWT and extract its claims.

## 5. Services

Services in `src/mastra/services/` provide reusable logic and connections:

- **`QdrantService.ts`**: Manages the connection and interaction with the Qdrant vector database.
- **`OpenAIService.ts`**: Manages interactions with the OpenAI API for embeddings and language model completions.
- **`RoleService.ts`**: Contains the logic for managing the role hierarchy and expanding user roles.
- **`AuthenticationService.ts`**: Handles the logic related to user authentication.

## 6. Schemas and Validation

- **Zod** is used extensively to define schemas for agent inputs, tool arguments, and workflow outputs.
- Schema files like `src/mastra/schemas/agent-schemas.ts` ensure that data flowing through the system is well-structured and type-safe, which is critical for the reliability of the agentic pipeline.
