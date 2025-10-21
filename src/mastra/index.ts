import { Mastra } from '@mastra/core'
import { answererAgent } from './agents/answerer.agent'
import { rerankAgent } from './agents/rerank.agent'
import { retrieveAgent } from './agents/retrieve.agent'
import { verifierAgent } from './agents/verifier.agent'
import { log } from './config/logger'
import { governedRagAnswer } from './workflows/governed-rag-answer.workflow'
import { governedRagIndex } from './workflows/governed-rag-index.workflow'
// MastraAuthSupabase is commented out for now, will be enabled in production
//import { MastraAuthSupabase } from '@mastra/auth-supabase';
import { LangfuseExporter } from './ai-tracing'
import { SamplingStrategyType } from '@mastra/core/ai-tracing'
import { pgStore, pgVector } from './config/pg-storage'
import { researchAgent } from './agents/researchAgent'
import { starterAgent } from './agents/starterAgent'
import { assistantAgent } from './agents/assistant'
import { researchWorkflow } from './workflows/researchWorkflow'
import { reportAgent } from './agents/reportAgent'
import { copywriterAgent } from './agents/copywriterAgent'
import { evaluationAgent } from './agents/evaluationAgent'
import { learningExtractionAgent } from './agents/learningExtractionAgent'
import { productRoadmapAgent } from './agents/productRoadmapAgent'
import { editorAgent } from './agents/editorAgent'
import { generateReportWorkflow } from './workflows/generateReportWorkflow'
import { chatWorkflow } from './workflows/chatWorkflow1'
import { financialAnalysisWorkflow } from './workflows/financialAnalysisWorkflow'
import { financialAnalysisWorkflowV2 } from './workflows/financialAnalysisWorkflowV2'
import { financialAnalysisWorkflowV3 } from './workflows/financialAnalysisWorkflowV3'
import { contentGenerationWorkflow } from './workflows/contentGenerationWorkflow'
import { randomUUID } from 'crypto'
import { SensitiveDataFilter } from '@mastra/core/ai-tracing'
import { researchContentNetwork, governedRagNetwork, financialTeamNetwork } from './agents/network'
import { apiRoutes } from './apiRegistry'
//import { mcpAgent } from './agents/mcpAgent'
import { responseQualityScorer, taskCompletionScorer } from './agents/custom-scorers'
import { identityAgent } from './agents/identity.agent'
import { policyAgent } from './agents/policy.agent'
import { cryptoAnalysisAgent } from './agents/cryptoAnalysisAgent'
import { stockAnalysisAgent } from './agents/stockAnalysisAgent'
import { marketEducationAgent } from './agents/marketEducationAgent'
//import { selfReferencingAgent } from './agents/selfReferencingAgent'
//import { ssAgent } from './agents/ss'
import { a2aCoordinatorAgent } from './agents/a2aCoordinatorAgent'
import { a2aCoordinatorMcpServer } from './mcp'
import { csvToExcalidrawAgent } from './agents/csv_to_excalidraw'
import { imageToCsvAgent } from './agents/image_to_csv'
import { excalidrawValidatorAgent } from './agents/excalidraw_validator'
import { voiceAgent } from './agents/voiceAgent'

export const mastra = new Mastra({
    storage: pgStore,
    logger: log,
    agents: {
        retrieve: retrieveAgent,
        rerank: rerankAgent,
        answerer: answererAgent,
        verifier: verifierAgent,
        identity: identityAgent,
        policy: policyAgent,
        starter: starterAgent,
        research: researchAgent,
        researcher: researchAgent,
        assist: assistantAgent,
        assistant: assistantAgent, // backward-compatible alias
        report: reportAgent,
        copywriter: copywriterAgent,
        evaluation: evaluationAgent,
        learning: learningExtractionAgent,
        productRoadmap: productRoadmapAgent,
        editor: editorAgent,
        //mcp: mcpAgent,
        cryptoAnalysis: cryptoAnalysisAgent,
        stockAnalysis: stockAnalysisAgent,
        marketEducation: marketEducationAgent,
//        selfReferencing: selfReferencingAgent,
//        ssAgent,
        a2aCoordinator: a2aCoordinatorAgent,
        csvToExcalidraw: csvToExcalidrawAgent,
        imageToCsv: imageToCsvAgent,
        excalidrawValidator: excalidrawValidatorAgent,
//        voice: voiceAgent,
        // Add more agents here
        'research-content-network': researchContentNetwork,
        'governed-rag-network': governedRagNetwork,
        'financial-team-network': financialTeamNetwork,
        // Add more agents here
    },
    workflows: {
        'governed-rag-index': governedRagIndex,
        'governed-rag-answer': governedRagAnswer,
        'research-workflow': researchWorkflow,
        'generate-report-workflow': generateReportWorkflow,
        'chat-workflow': chatWorkflow,
        'chat-workflow-1': chatWorkflow, // backward-compatible alias
        'content-generation': contentGenerationWorkflow,
        'financial-analysis-workflow': financialAnalysisWorkflow,
        'financial-analysis-workflow-v2': financialAnalysisWorkflowV2,
        'financial-analysis-workflow-v3': financialAnalysisWorkflowV3,
    },
    scorers: {
            // Mastra expects the scorer implementation directly at the top-level.
            // Remove the unsupported `implementation` wrapper to match MastraScorer type.
            responseQuality: responseQualityScorer,
            taskCompletion: taskCompletionScorer,
    },
    vectors: {
        pgVector,
    },
    mcpServers: {
            a2aCoordinator: a2aCoordinatorMcpServer
    },
    server: {
//        host: process.env.MASTRA ?? 'http://localhost', // Defaults to 'localhost'
//        port: parseInt(process.env.PORT ?? '4111'), // Defaults to 4111
        timeout: 20000, // Defaults to 30000 (30s)
        apiRoutes,
        // Body size limit for incoming requests
        // Note: This is a placeholder and should be adjusted based on your server setup and environment.
        // In production, you should set a more restrictive limit based on your server's requirements.
        // Also, consider setting up a reverse proxy in production to handle SSL and routing.
        // For example, you can use an Nginx reverse proxy to handle SSL and routing:
        //
        // server {
        //     listen 443 ssl;
        //     server_name your-domain.com;
        //
        //     ssl_certificate /path/to/certificate.pem;
        //     ssl_certificate_key /path/to/private.key;
        //
        //     location / {
        //         proxy_pass http://localhost:4111;
        //         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        //     }
        // }
        bodySizeLimit: 64 * 1024 * 1024, // 16MB  @defaults to 4096 (4MB)
        build:{
            swaggerUI: true,
            openAPIDocs: true,
            apiReqLogs: true,
        },
        cors: {
            origin: '*', // Allow all origins for development; restrict in production
            allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization', 'x-mastra-client-type'],
            exposeHeaders: ['Content-Length', 'X-Requested-With'],
            credentials: false // Disable credentials for development; enable in production if needed
        },
        // Add authentication in production
        //        experimental_auth: new MastraAuthSupabase({
        //            url: process.env.SUPABASE_URL,
        //            anonKey: process.env.SUPABASE_ANON_KEY
        //        }),
        middleware: [
            {
                handler: async (c, next) => {
                    // Example: Add authentication check
                    // const authHeader = c.req.header("Authorization");
                    // if (!authHeader) {
                    //   return new Response("Unauthorized", { status: 401 });
                    // }
                    c.header('Access-Control-Allow-Origin', '*');
                    c.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS',);
                    c.header(
                        'Access-Control-Allow-Headers',
                        'Content-Type, Authorization',
                    );
                    if (c.req.method === 'OPTIONS') {
                        return new Response(null, { status: 204 });
                    }
                    await next();
                },
                path: "/api/*",
            },
                // Add a global request logger
                async (c, next) => {// This is a global logger for all API requests
                    log.info(`[API Request] ${c.req.method} ${c.req.url}`);
                    await next();
    },
    ],
    },
    observability: {
        default: { enabled: true }, // Enable default tracing with DefaultExporter and CloudExporter
        configs: {
            langfuse: {
                serviceName: process.env.SERVICE_NAME ?? 'mastra',
                sampling: { type: SamplingStrategyType.ALWAYS },
                exporters: [
                    new LangfuseExporter({
                        publicKey: process.env.LANGFUSE_PUBLIC_KEY,
                        secretKey: process.env.LANGFUSE_SECRET_KEY,
                        baseUrl: process.env.LANGFUSE_BASE_URL, // Optional
                        realtime: process.env.NODE_ENV === 'development',
                        logLevel: 'debug',
                        options: {
                            batchSize: 200,
                            flushInterval: 5000,
                        },
                    }),
                ],
                processors: [
                    new SensitiveDataFilter({
                        // Add custom sensitive fields
                        sensitiveFields: [
                            // Default fields
                            'password',
                            'token',
                            'secret',
                            'key',
                            'apikey',
                            'auth',
                            'authorization',
                            'bearer',
                            'bearertoken',
                            'jwt',
                            'credential',
                            'clientsecret',
                            'privatekey',
                            'refresh',
                            'ssn',
                            // Custom fields for your application
                            'creditCard',
                            'bankAccount',
                            'routingNumber',
                            'email',
                            'phoneNumber',
                            'dateOfBirth',
                            'socialSecurityNumber',
                            'address',
                        ],
                        // Custom redaction token
                        redactionToken: '***SENSITIVE***',
                        // Redaction style
                        redactionStyle: 'full', // or 'partial'
                    }),
                ],
                includeInternalSpans: true, // Optional, default is false
            },
        },
    },
    idGenerator: () => `${randomUUID()}`, // Prefix for all IDs generated by Mastra
})
log.info('Mastra instance initialized')
