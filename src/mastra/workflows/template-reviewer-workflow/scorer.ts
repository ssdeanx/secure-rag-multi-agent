import z from "zod";
import { testerOutputSchema } from "./tester.js";
import type { claimsSchema } from "./claim-extractor.js";
import type { planMakerOutputSchema } from "./plan-maker.js";

export const scorerOutputSchema = z.object({
  descriptionQuality: z.object({
    score: z.number().min(1).max(5),
    explanation: z.string(),
  }),
  tests: testerOutputSchema,
  appeal: z.object({
    score: z.number().min(1).max(5),
    explanation: z.string(),
  }),
  creativity: z.object({
    score: z.number().min(1).max(5),
    explanation: z.string(),
  }),
  architecture: z.object({
    agents: z.object({
      count: z.number(),
    }),
    tools: z.object({
      count: z.number(),
    }),
    workflows: z.object({
      count: z.number(),
    }),
  }),
  tags: z.array(z.string()),
});

export const scorerPrompt = (props: {
  project: {
    name: string;
    description: string;
    repoURL: string;
    videoURL: string;
  };
  projectStats: Pick<z.infer<typeof scorerOutputSchema>, "architecture"> & {
    detectedTechnologies: {
      [key: string]: boolean;
    };
  };
  claims: z.infer<typeof claimsSchema>;
  plans: z.infer<typeof planMakerOutputSchema>;
}) => {
  const { project, claims, plans } = props;
  return `You are an impartial senior judge for the Mastra.Build hackathon. Score a Mastra AI template using objective, rubric-driven criteria. Only return JSON strictly matching the provided schema.

Context to evaluate
---
Project
- name: ${project.name}
- repoURL: ${project.repoURL}
- videoURL: ${project.videoURL}
- description: \n${project.description}
- stats: ${JSON.stringify(props.projectStats, null, 2)}

Extracted claims (present-tense capabilities)
${JSON.stringify(claims, null, 2)}

Test plans (exactly 3, turn-by-turn chat interactions)
${JSON.stringify(plans, null, 2)}

Scoring rubric (map to schema fields)
---
1) descriptionQuality.score (1-5)
- 5: Clear, complete, actionable README; setup and usage obvious; constraints noted
- 3: Mostly clear with minor gaps; some assumptions missing
- 1: Sparse/unclear; key steps or purpose missing
Include explanation citing specifics from description and claims.

2) tests (array of results for plan-1..plan-3)
For each plan id in input, emit an object { id, passed, explanation }.
- If real execution data is unavailable, set passed=false and explain that results are pending execution. Do not invent execution logs.

3) appeal.score (1-5)
Weigh usefulness for end users or developers, alignment with Mastra, and relevance to hackathon tracks. Explain rationale.

4) creativity.score (1-5)
Assess novelty of approach, problem framing, or integrations. Cite unique elements from claims/plans.

5) architecture.counts
Estimate counts of agents, tools, and workflows from description and claims. If unknown, return 0. Do not fabricate specific names, only counts.

6) tags
Emit lowercase, kebab-case tags capturing eligibility for prize tracks and general categorization. Include applicable tags based on description/claims/plans, such as:
- eligible-best-overall
- eligible-agentnetwork
- eligible-productivity
- eligible-coding-agent
- eligible-browserbase (web browsing / browser automation)
- eligible-smithery (MCP server / @smithery/sdk)
- eligible-arcade (tool provider / @arcadeai/arcadejs or arcade-ai)
- eligible-workos (auth / @workos/node)
- eligible-chroma (RAG / chromadb)
- eligible-recall (crypto/blockchain)
- eligible-confident-ai (evals)
Also include a few topical tags from the project domain (e.g., research, rag, auth, web-browsing) but avoid duplicates.

Output requirements
---
- Return JSON only, matching the schema exactly.
- tests must include one entry per provided plan id.
- Explanations should be specific but concise (1-4 sentences).
`;
};
