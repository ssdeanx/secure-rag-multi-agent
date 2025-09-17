import { createWorkflow, createStep } from "@mastra/core";
import { z } from "zod";

import { answererAgent, answererOutputSchema } from "../agents/answerer.agent";
import { rerankAgent, rerankOutputSchema } from "../agents/rerank.agent";
import { retrieveAgent, retrieveOutputSchema } from "../agents/retrieve.agent";
import { verifierAgent, verifierOutputSchema } from "../agents/verifier.agent";
import { logStepStart, logStepEnd, logAgentActivity, logError } from "../config/logger";
import { jwtClaimsSchema, accessFilterSchema, documentContextSchema, ragAnswerSchema, verificationResultSchema } from "../schemas/agent-schemas";
import { AuthenticationService } from "../services/AuthenticationService";

// Step 1: Combined Authentication and Authorization
const authenticationStep = createStep({
  id: 'authentication',
  description: 'Verify JWT token and generate access policy',
  inputSchema: z.object({
    jwt: z.string(),
    question: z.string()
  }),
  outputSchema: z.object({
    accessFilter: accessFilterSchema,
    question: z.string()
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    logStepStart('authentication', { question: inputData.question, hasJWT: !!inputData.jwt });

    try {
      const { claims, accessFilter } = await AuthenticationService.authenticateAndAuthorize(inputData.jwt);

      const output = {
        accessFilter,
        question: inputData.question
      };

      logStepEnd('authentication', { accessFilter: accessFilter.allowTags, maxClassification: accessFilter.maxClassification }, Date.now() - startTime);
      return output;
    } catch (error) {
      logError('authentication', error, { question: inputData.question });
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// Step 2: Retrieve and Rerank documents
const retrievalStep = createStep({
  id: 'retrieval-and-rerank',
  description: 'Retrieve documents with security filters and rerank by relevance',
  inputSchema: z.object({
    accessFilter: accessFilterSchema,
    question: z.string()
  }),
  outputSchema: z.object({
    contexts: z.array(documentContextSchema),
    question: z.string()
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    console.log(`[${requestId}] 🚀 Starting document retrieval for question: "${inputData.question}"`);
    logStepStart('retrieval-and-rerank', { accessFilter: inputData.accessFilter.allowTags, question: inputData.question, requestId });

    try {
      logAgentActivity('retrieve', 'querying-documents', { allowTags: inputData.accessFilter.allowTags, maxClassification: inputData.accessFilter.maxClassification, requestId });

      // Retrieve documents using mastra context
      const agent = mastra?.getAgent('retrieve') || retrieveAgent;
      console.log(`[${requestId}] 🤖 Calling retrieve agent...`);

      const retrieveResult = await agent.generate(JSON.stringify({
        question: inputData.question,
        access: inputData.accessFilter,
        requestId: requestId  // Pass request ID to agent for tracking
      }), {
        toolChoice: 'required'  // Force tool usage to ensure results are captured
      });

      console.log(`[${requestId}] ✅ Retrieve agent completed`);
      console.log(`[${requestId}] 🔍 Tool results available:`, retrieveResult.toolResults?.length || 0);
      console.log(`[${requestId}] 📋 Full retrieve result structure:`, JSON.stringify({
        hasToolResults: !!retrieveResult.toolResults,
        toolResultsLength: retrieveResult.toolResults?.length,
        toolResultsKeys: retrieveResult.toolResults?.map(tr => ({ toolName: tr.toolName, hasResult: !!tr.result })),
        hasText: !!retrieveResult.text,
        textLength: retrieveResult.text?.length,
        textPreview: retrieveResult.text?.substring(0, 200)
      }, null, 2));

      let contexts: any[] = [];

      // Method 1: Extract from tool results (preferred)
      if (retrieveResult.toolResults && retrieveResult.toolResults.length > 0) {
        console.log(`[${requestId}] 🔧 Found tool results, checking for vector query tool...`);
        
        // Try multiple possible tool names
        const possibleToolNames = ['vectorQueryTool', 'vector-query', 'vectorQuery'];
        let toolResult = null;
        
        for (const toolName of possibleToolNames) {
          toolResult = retrieveResult.toolResults.find(tr => tr.toolName === toolName);
          if (toolResult) {
            console.log(`[${requestId}] ✅ Found tool result with name: ${toolName}`);
            break;
          }
        }
        
        if (!toolResult) {
          // If no match found, take the first available tool result
          toolResult = retrieveResult.toolResults[0];
          console.log(`[${requestId}] 🔄 No matching tool name found, using first tool result: ${toolResult.toolName}`);
        }
        
        if (toolResult && toolResult.result && toolResult.result.contexts) {
          contexts = toolResult.result.contexts;
          console.log(`[${requestId}] 📄 Extracted ${contexts.length} contexts from tool results`);
        } else {
          console.log(`[${requestId}] ⚠️ Tool result found but no contexts property`, {
            toolName: toolResult?.toolName,
            hasResult: !!toolResult?.result,
            resultKeys: toolResult?.result ? Object.keys(toolResult.result) : []
          });
        }
      } else {
        console.log(`[${requestId}] ⚠️ No tool results found - tool may not be executing`);
      }

      // SECURE text response parsing: Only accept real database results
      if (contexts.length === 0 && retrieveResult.text) {
        try {
          // First, check if this looks like a real tool response
          if (retrieveResult.text.startsWith('{"contexts"') && retrieveResult.text.endsWith('}')) {
            const parsed = JSON.parse(retrieveResult.text);
            if (parsed.contexts && Array.isArray(parsed.contexts)) {
              // STRICT SECURITY VALIDATION: Only accept real database results
              const validContexts = parsed.contexts.filter((ctx: { docId: any; text: string | string[]; score: number; versionId: any; source: any; securityTags: any; classification: any; }) => {
                return (
                  // Must have core database fields
                  ctx.docId &&
                  ctx.text &&
                  typeof ctx.score === 'number' &&
                  ctx.versionId &&
                  ctx.source &&
                  Array.isArray(ctx.securityTags) &&
                  ctx.classification &&
                  // Text must not look like generated content
                  !ctx.text.includes('The Termination Procedures are as follows') &&
                  !ctx.text.includes('# Git Workflow at ACME') &&
                  // Score must be realistic (0-1 range)
                  ctx.score >= 0 && ctx.score <= 1
                );
              });

              if (validContexts.length > 0) {
                contexts = validContexts;
                console.log(`[${requestId}] 📄 Extracted ${contexts.length} validated contexts from agent response`);
              } else {
                console.log(`[${requestId}] 🚫 Rejected ${parsed.contexts.length} contexts - failed security validation`);
              }
            }
          }
        } catch (e) {
          console.log(`[${requestId}] ⚠️ Failed to parse agent text response as JSON`);
        }
      }

      // Skip reranking if no contexts
      if (!contexts || contexts.length === 0) {
        logStepEnd('retrieval-and-rerank', { contextsFound: 0 }, Date.now() - startTime);
        return {
          contexts: [],
          question: inputData.question
        };
      }

      // Rerank contexts for relevance
      try {
        const rerankResult = await rerankAgent.generate(JSON.stringify({
          question: inputData.question,
          contexts: contexts
        }), {
          experimental_output: rerankOutputSchema
        });

        const rerankResponse = rerankResult.object || { contexts: [] };
        const output: { contexts: any; question: string; } = {
          contexts: rerankResponse.contexts || contexts,
          question: inputData.question
        };

        logStepEnd('retrieval-and-rerank', { contextsFound: output.contexts.length }, Date.now() - startTime);
        return output;
      } catch (error) {
        // If reranking fails, return original contexts
        const output: { contexts: any; question: string; } = {
          contexts,
          question: inputData.question
        };

        logStepEnd('retrieval-and-rerank', { contextsFound: output.contexts.length, rerankFailed: true }, Date.now() - startTime);
        return output;
      }
    } catch (error) {
      logError('retrieval-and-rerank', error, { accessFilter: inputData.accessFilter });
      throw new Error(`Document retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});


// Step 3: Generate answer from contexts
const answerStep = createStep({
  id: 'answer-generation',
  description: 'Generate answer from authorized contexts',
  inputSchema: z.object({
    contexts: z.array(documentContextSchema),
    question: z.string()
  }),
  outputSchema: z.object({
    answer: ragAnswerSchema,
    contexts: z.array(documentContextSchema),
    question: z.string()
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    logStepStart('answer-generation', { contextsCount: inputData.contexts.length, question: inputData.question });

    try {
      logAgentActivity('answerer', 'generating-answer', { contextsCount: inputData.contexts.length });

      const result = await answererAgent.generate(JSON.stringify({
        question: inputData.question,
        contexts: inputData.contexts
      }), {
        experimental_output: answererOutputSchema
      });

      const answer = result.object || { answer: "Unable to generate answer", citations: [] };

      // Ensure we always have a proper response for no contexts
      if (inputData.contexts.length === 0 && (!answer.answer || answer.answer.trim() === "")) {
        answer.answer = "No authorized documents found that contain information about this topic.";
        answer.citations = [];
      }
      const output = {
        answer,
        contexts: inputData.contexts,
        question: inputData.question
      };

      logStepEnd('answer-generation', { citationsCount: answer.citations?.length || 0 }, Date.now() - startTime);
      return output;
    } catch (error) {
      logError('answer-generation', error, { contextsCount: inputData.contexts.length });
      throw new Error(`Answer generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// Step 4: Verify answer for security compliance
const verifyStep = createStep({
  id: 'answer-verification',
  description: 'Verify answer complies with security policies',
  inputSchema: z.object({
    answer: ragAnswerSchema,
    contexts: z.array(documentContextSchema),
    question: z.string()
  }),
  outputSchema: z.object({
    answer: z.string(),
    citations: z.array(z.object({
      docId: z.string(),
      source: z.string()
    }))
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    logStepStart('answer-verification', { citationsCount: inputData.answer.citations?.length || 0, question: inputData.question });

    try {
      logAgentActivity('verifier', 'verifying-answer', { citationsCount: inputData.answer.citations?.length || 0 });

      const result = await verifierAgent.generate(JSON.stringify({
        answer: inputData.answer,
        question: inputData.question,
        contexts: inputData.contexts
      }), {
        experimental_output: verifierOutputSchema
      });

      const verification = result.object || { ok: false, reason: "Verification failed" };

      if (!verification.ok) {
        // Handle specific case where answer indicates insufficient evidence
        if (inputData.answer.answer.includes("No authorized documents found") ||
          inputData.answer.answer.includes("don't contain information about this")) {
          const output = {
            answer: inputData.answer.answer,
            citations: inputData.answer.citations || []
          };
          logStepEnd('answer-verification', { verified: true, insufficientEvidence: true, citationsCount: output.citations.length }, Date.now() - startTime);
          return output;
        }

        logError('answer-verification', new Error(verification.reason), { reason: verification.reason });
        throw new Error(verification.reason || 'Answer failed security verification');
      }

      const output = {
        answer: inputData.answer.answer,
        citations: inputData.answer.citations || []
      };

      logStepEnd('answer-verification', { verified: true, citationsCount: output.citations.length }, Date.now() - startTime);
      return output;
    } catch (error) {
      logError('answer-verification', error, { question: inputData.question });
      throw new Error(`Answer verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// Create the workflow
export const governedRagAnswer = createWorkflow({
  id: "governed-rag-answer",
  description: "Multi-agent governed RAG: auth → retrieve+rerank → answer → verify",
  inputSchema: z.object({
    jwt: z.string(),
    question: z.string()
  }),
  outputSchema: z.object({
    answer: z.string(),
    citations: z.array(z.object({
      docId: z.string(),
      source: z.string()
    }))
  }),
})
  .then(authenticationStep)
  .then(retrievalStep)
  .then(answerStep)
  .then(verifyStep)
  .commit();