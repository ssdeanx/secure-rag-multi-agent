import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: "https://localhost:4111",
  headers: {
    Authorization: `Bearer ${process.env.JWT_TOKEN}`
  }
});
