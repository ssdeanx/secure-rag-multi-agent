import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { logger } from "./logger";

logger.info("Setting up LibSQLStore and LibSQLVector...");

export const libsqlStore = new LibSQLStore({
  url: process.env.LIBSQL_URL ?? 'file:./mastra.db',
});

export const libsqlVector = new LibSQLVector({
  connectionUrl: process.env.LIBSQL_URL ?? 'file:./mastra.db',
  authToken: process.env.LIBSQL_AUTH_TOKEN ?? '',
  syncUrl: process.env.LIBSQL_SYNC_URL ?? '',
});

export const memory = new Memory({
    storage: libsqlStore,
    vector: libsqlVector,
    embedder: undefined // To be set when used
});
