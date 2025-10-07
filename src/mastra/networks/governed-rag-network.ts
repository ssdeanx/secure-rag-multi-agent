/**
 * Governed RAG Network
 *
 * A secure, role-based RAG system network that orchestrates multiple specialized
 * agents for document retrieval, security validation, and response generation.
 *
 * Key Features:
 * - Hierarchical RBAC with role-based access control
 * - Zero-trust security validation at every stage
 * - Multi-agent pipeline for secure document retrieval
 * - Compliance checking and audit logging
 *
 * Use Cases:
 * - Secure knowledge base queries with access control
 * - Document retrieval with classification filtering
 * - Role-based content access and verification
 * - Compliance-aware response generation
 */

import { Agent } from '@mastra/core/agent'
import { google } from '@ai-sdk/google'
import { retrieveAgent } from '../agents/retrieve.agent'
import { rerankAgent } from '../agents/rerank.agent'
import { answererAgent } from '../agents/answerer.agent'
import { verifierAgent } from '../agents/verifier.agent'
import { governedRagAnswer } from '../workflows/governed-rag-answer.workflow'
import { pgMemory } from '../config/pg-storage'

/**
 * Governed RAG Network
 *
 * Security Pipeline Agents:
 * - retrieveAgent: Queries Qdrant with security filters based on user roles
 * - rerankAgent: Relevance scoring with continued access validation
 * - answererAgent: Generates secure responses with citations
 * - verifierAgent: Final compliance checking and audit logging
 * - governedRagAnswer: Complete 6-stage secure RAG workflow
 *
 * Security Features:
 * - Role hierarchy: admin > dept_admin > dept_viewer > employee > public
 * - Document classifications: public, internal, confidential
 * - Department-based access control with tag filtering
 * - Step-up authentication for elevated access
 * - Audit logging for compliance
 *
 * The network ensures zero-trust security by validating access at every stage.
 */
export const governedRagNetwork = new Agent({
    id: 'governed-rag-network',
    name: 'Governed RAG Network',
    instructions: `
    A secure RAG system with multi-agent orchestration and role-based access control.
    
    Capabilities:
    - Retrieve documents with security filtering based on user roles
    - Rerank results while maintaining access controls
    - Generate responses with proper citations
    - Verify compliance and log security events
    
    Security Model:
    - Hierarchical roles with inheritance (admin → employee → public)
    - Three classification levels (public, internal, confidential)
    - Department-based filtering for fine-grained access
    - Zero-trust validation throughout the pipeline
    
    Use this network when you need:
    - Secure document retrieval with access control
    - Role-based knowledge base queries
    - Compliance-aware response generation
    - Audit trails for regulatory requirements
  `,
    model: google('gemini-2.5-flash-preview-09-2025'),

    // Security pipeline agents
    agents: {
        retrieve: retrieveAgent,
        rerank: rerankAgent,
        answerer: answererAgent,
        verifier: verifierAgent,
    },

    // Complete RAG workflow
    workflows: {
        'governed-rag-answer': governedRagAnswer,
    },

    // Memory for task history and security context
    memory: pgMemory,
})

/**
 * Example Usage:
 *
 * 1. Simple Query with Role-Based Access
 *
 * ```typescript
 * const network = mastra.vnext_getNetwork('governed-rag-network');
 *
 * // User with finance viewer role
 * const result = await network.generate(
 *   'What are the expense approval thresholds?',
 *   {
 *     runtimeContext: {
 *       // JWT claims from authentication
 *       principal: {
 *         sub: 'user123',
 *         roles: ['role:finance_viewer'],
 *         tenant: 'acme',
 *         attrs: { department: 'finance' }
 *       }
 *     }
 *   }
 * );
 *
 * // Result includes only documents accessible to finance_viewer role
 * ```
 *
 * 2. Complex Query with Multi-Agent Routing
 *
 * ```typescript
 * // The loop() method breaks down the query and routes to appropriate agents
 * const result = await network.loop(
 *   `Search for all financial policies related to expense approval.
 *    Then compare the thresholds across different departments.
 *    Finally, verify that I have access to view all the documents and
 *    generate a summary with proper citations.`,
 *   {
 *     runtimeContext: {
 *       principal: {
 *         sub: 'admin@acme.com',
 *         roles: ['role:admin'],
 *         tenant: 'acme',
 *         attrs: {}
 *       }
 *     }
 *   }
 * );
 * ```
 *
 * 3. Streaming with Progress Updates
 *
 * ```typescript
 * const stream = await network.stream(
 *   'What are the HR confidential policies for employee termination?',
 *   {
 *     runtimeContext: {
 *       principal: {
 *         sub: 'hr_admin@acme.com',
 *         roles: ['role:hr_admin'],
 *         tenant: 'acme',
 *         attrs: { department: 'hr', clearance: 'confidential' }
 *       }
 *     }
 *   }
 * );
 *
 * for await (const chunk of stream) {
 *   // chunk.type: 'retrieve', 'rerank', 'answer', 'verify'
 *   // chunk.data: stage-specific data
 *   console.log(`Stage: ${chunk.type}`, chunk.data);
 * }
 * ```
 *
 * 4. Client-Side Usage with Authentication
 *
 * ```typescript
 * import { MastraClient } from '@mastra/client-js';
 *
 * const client = new MastraClient({
 *   headers: {
 *     'Authorization': `Bearer ${jwtToken}`
 *   }
 * });
 *
 * const network = client.getVNextNetwork('governed-rag-network');
 *
 * // JWT is automatically passed to runtimeContext
 * const result = await network.generate(
 *   'Show me all engineering documents about the authentication system'
 * );
 * ```
 */

/**
 * Security Architecture:
 *
 * 1. Identity Validation (Handled by JWT middleware)
 *    - JWT token validated before reaching network
 *    - Claims extracted: sub (user ID), roles, tenant, attrs
 *    - Tenant isolation enforced
 *
 * 2. Policy Generation (Dynamic based on roles)
 *    - Role hierarchy determines accessible classifications
 *    - Department attrs enable tag-based filtering
 *    - Access filters generated: { tags, classifications, minScore }
 *
 * 3. Retrieval (retrieveAgent)
 *    - Qdrant vector search with security filters
 *    - Metadata filtering enforces access control
 *    - Only returns authorized documents
 *
 * 4. Reranking (rerankAgent)
 *    - Relevance scoring with continued access validation
 *    - Filters out any unauthorized results
 *    - Maintains security context
 *
 * 5. Response Generation (answererAgent)
 *    - Creates response from authorized documents only
 *    - Includes proper citations with metadata
 *    - Avoids exposing restricted information
 *
 * 6. Verification (verifierAgent)
 *    - Final compliance checking
 *    - Audit event logging
 *    - Security validation of response
 */

/**
 * Role Hierarchy (Numeric scores for inheritance):
 *
 * admin (100)           - Full access to all classifications and departments
 * dept_admin (80)       - Admin access within department
 * dept_viewer (60)      - Read access within department
 * employee (40)         - Internal documents only
 * public (10)           - Public documents only
 *
 * Classification Levels:
 *
 * confidential  - Requires elevated access (step-up auth)
 * internal      - Employee access and above
 * public        - Anyone can access
 *
 * Access Examples:
 *
 * finance_viewer:
 * - Can access: public + internal documents tagged with "finance"
 * - Cannot access: confidential, other departments
 *
 * hr_admin:
 * - Can access: all classifications within HR department
 * - Can access: public + internal across all departments
 * - Cannot access: confidential in other departments
 *
 * admin:
 * - Can access: everything across all departments
 * - Full visibility into all classifications
 */

/**
 * Compliance and Audit:
 *
 * Every query is logged with:
 * - User identity (sub, roles, tenant)
 * - Query text and timestamp
 * - Retrieved documents (IDs, classifications)
 * - Access decisions (allowed/denied)
 * - Response metadata
 *
 * Logs stored in:
 * - logs/workflow.log (local development)
 * - Langfuse (observability platform)
 * - PinoLogger (structured logging)
 *
 * Audit events include:
 * - Successful retrievals
 * - Access denials
 * - Step-up authentication triggers
 * - Classification changes
 * - Role modifications
 */

/**
 * Network vs Workflow Decision:
 *
 * Use Governed RAG Network when:
 * - Query requires reasoning about which documents to retrieve
 * - User intent is ambiguous or multi-faceted
 * - Need dynamic routing between retrieval strategies
 * - Complex questions requiring multiple retrieval passes
 *
 * Use Governed RAG Workflow when:
 * - Standard retrieval → rerank → answer → verify flow
 * - Predictable, deterministic execution needed
 * - Performance optimization important (workflow is faster)
 * - Integration with existing API endpoints
 *
 * Best Practice:
 * - Start with workflow for standard queries
 * - Use network for complex, multi-step queries
 * - Monitor performance and routing decisions
 * - Tune agent descriptions for better routing
 */
