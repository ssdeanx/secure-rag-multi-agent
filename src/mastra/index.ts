import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { QdrantVector } from "@mastra/qdrant";

import { answererAgent } from "./agents/answerer.agent";
import { rerankAgent } from "./agents/rerank.agent";
import { retrieveAgent } from "./agents/retrieve.agent";
import { verifierAgent } from "./agents/verifier.agent";
import { logger } from "./config/logger";
import { governedRagAnswer } from "./workflows/governed-rag-answer.workflow";
import { governedRagIndex } from "./workflows/governed-rag-index.workflow";
import { MastraJwtAuth } from '@mastra/auth';

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: 'file:./mastra.db',
  }),
  logger,
  agents: {
    retrieve: retrieveAgent,
    rerank: rerankAgent,
    answerer: answererAgent,
    verifier: verifierAgent
  },
  workflows: { 'governed-rag-index': governedRagIndex, 'governed-rag-answer': governedRagAnswer },
  vectors: {
    qdrant: new QdrantVector({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY,
    }),
  },
  server: {
    experimental_auth: new MastraJwtAuth({
        secret: process.env.JWT_SECRET!
    }),
  },
});
