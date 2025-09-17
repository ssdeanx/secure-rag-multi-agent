import { mastra } from '../mastra/index';
import { logWorkflowStart, logWorkflowEnd, logError, logProgress, logger } from '../mastra/config/logger';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';

dotenv.config();

async function indexDocuments() {
  logger.info('🚀 Starting document indexing for Governed RAG');
  
  const sampleDocs: any[] = [
    {
      filePath: path.join(__dirname, '../../corpus/finance-policy.md'),
      docId: 'finance-policy-001',
      classification: 'internal' as const,
      allowedRoles: ['finance.viewer', 'finance.admin', 'admin'],
      tenant: process.env.TENANT || 'acme',
      source: 'Finance Department Policy Manual'
    },
    {
      filePath: path.join(__dirname, '../../corpus/engineering-handbook.md'),
      docId: 'eng-handbook-001',
      classification: 'public' as const,
      allowedRoles: ['engineering.viewer', 'engineering.admin', 'admin'],
      tenant: process.env.TENANT || 'acme',
      source: 'Engineering Team Handbook'
    },
    {
      filePath: path.join(__dirname, '../../corpus/hr-confidential.md'),
      docId: 'hr-conf-001',
      classification: 'confidential' as const,
      allowedRoles: ['hr.admin', 'admin'],
      tenant: process.env.TENANT || 'acme',
      source: 'HR Confidential Documents'
    }
  ];

  const validDocs: any[] = [];
  for (const doc of sampleDocs) {
    try {
      await fs.access(doc.filePath);
      logger.info(`✅ Found: ${path.basename(doc.filePath)}`);
      validDocs.push(doc);
    } catch {
      logger.warn(`⚠️ Skipping: ${path.basename(doc.filePath)} (not found)`);
    }
  }

  if (validDocs.length === 0) {
    logger.warn('❌ No documents found to index. Please add documents to the corpus/ directory.');
    return;
  }

  try {
    const startTime = Date.now();
    logWorkflowStart('governed-rag-index', { documents: validDocs });

    const workflow = mastra.getWorkflows()['governed-rag-index'];
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { documents: validDocs }
    });

    logger.info('📄 Document Details:');
    logWorkflowEnd('governed-rag-index', result as any, Date.now() - startTime);
    
    // Log document results
    const resultData = (result as any).result || result;
    if (resultData.documents) {
      resultData.documents.forEach((doc: any) => {
        if (doc.status === 'success') {
          logger.info(`✅ ${doc.docId}: ${doc.chunks} chunks indexed`);
        } else {
          logger.error(`❌ ${doc.docId}: ${doc.error}`);
        }
      });
    }
    logProgress(`Indexing complete`, resultData.indexed, resultData.indexed + resultData.failed);
  } catch (error) {
    logError('index-documents', error);
  }
}

async function queryRAG(jwt: string, question: string) {
  logger.info('🔍 Querying Governed RAG');
  
  try {
    const startTime = Date.now();
    logWorkflowStart('governed-rag-answer', { jwt, question });

    const workflow = mastra.getWorkflows()['governed-rag-answer'];
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: { jwt, question }
    });

    if (result.status === 'success') {
      const resultData = (result as any).result || result;
      logWorkflowEnd('governed-rag-answer', resultData, Date.now() - startTime);
      
      logger.info('✅ Answer generated successfully!');
      logger.info(`📝 Answer: ${resultData.answer}`);
      
      if (resultData.citations?.length > 0) {
        logger.info('📚 Citations:');
        resultData.citations.forEach((citation: any) => {
          logger.info(`- ${citation.docId}${citation.source ? ` (${citation.source})` : ''}`);
        });
      }
    } else {
      logError('workflow-execution', new Error('Query failed'), result);
    }
  } catch (error) {
    logError('query-rag', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    logger.info('Governed RAG CLI\n\nCommands:\n  index                      - Index sample documents\n  query <jwt> <question>     - Query with JWT auth\n  demo                       - Run interactive demo\n  help                       - Show this help message\n\nExamples:\n  npm run cli index\n  npm run cli query "eyJ..." "What is our finance policy?"\n  npm run cli demo');
  }

  switch (command) {
    case 'index':
      await indexDocuments();
      break;
      
    case 'query':
      const jwt = args[1];
      const question = args.slice(2).join(' ');
      
      if (!jwt || !question) {
        logger.error('❌ Usage: npm run cli query <jwt> <question>');
        return;
      }
      
      await queryRAG(jwt, question);
      break;
      
    case 'demo':
      logger.info('🎮 Interactive Demo Mode\nThis would launch an interactive demo (to be implemented)');
      break;
      
    default:
      logger.error(`❌ Unknown command: ${command}\nRun "npm run cli help" for usage information`);
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    logger.error(`Fatal error: ${error}`);
    process.exit(1);
  });
}