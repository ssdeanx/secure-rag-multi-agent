import z from "zod";

export const claimExtractorPrompt = (props: {
  transcript: string;
  documentation: string;
}) => {
  return `You are an expert technical analyst.

## Context

All submissions you will receive are **Mastra AI framework templates** that bundle sample agents and workflows. These templates will later be **tested** against the extracted claims to verify that they deliver the promised functionality. Your task in this step is solely to harvest those present‑tense claims.

## Task

Read the two sources below:

1. **Project documentation**
2. **YouTube demo video transcript**

Extract **every explicit or implicit “claim” or “promise”** the team makes about what the hackathon project *currently does* — i.e., capabilities that are already implemented or demonstrably working in the demo.
Do **not** include road‑map items, future aspirations, or statements about what the team *plans* or *hopes* to add later.

## Definition

A claim / promise is any statement of **present** capability, outcome, feature, benefit, or performance metric (e.g., “supports offline mode”, “cuts deployment time by 50%”). Ignore future‑tense statements such as “will integrate with Stripe next quarter”.

## Output

1. **Primary agent (best estimate)**

   * **mainAgent** – the kebab‑case name of the entry‑point / primary agent mentioned in the sources. If no clear candidate, return "null".

2. **claims** – a structured list where each entry includes:

   * **name** – a concise, verb‑first summary of the capability (≤ 10 words).
   * **description** – the full claim text (or a faithful paraphrase) *plus* an evidence snippet (≤ 25 words) with line/time reference.

## Guidelines

---

* **Be exhaustive but non‑duplicative.** Combine near‑identical statements.
* **Stay neutral.** Quote the claim exactly; do **not** judge its truth.
* **One entry per claim.** If the same claim appears in both sources, list it once and reference the strongest evidence.
* Ignore background, storytelling, team bios, or implementation details that are not phrased as present‑tense capabilities.
* **Exclude** future promises, wish‑lists, or “coming soon” features.
* **Exclude** raw performance or other non‑functional metrics (e.g., speed, latency, uptime, scalability claims) that cannot be independently validated.

## Examples

**✅ EXTRACT these testable functional claims:**
- "Searches the web for current information" 
- "Summarizes PDF documents and includes findings in responses"
- "Generates comprehensive research reports"
- "Analyzes uploaded images and describes content"
- "Integrates with external APIs to fetch real-time data"
- "Maintains conversation context across multiple turns"
- "Provides step-by-step instructions for tasks"
- "Exports results in multiple formats (PDF, CSV, JSON)"

**❌ DO NOT EXTRACT these untestable technical claims:**
- "Works immediately after installation" (installation process can't be tested via chat)
- "Reduces token usage by 80-95%" (performance metrics require system monitoring) 
- "Lightning-fast response times" (speed claims need benchmarking tools)
- "Uses advanced AI algorithms" (implementation details aren't user-facing)
- "Optimized for production deployment" (infrastructure concerns aren't testable)
- "Built with cutting-edge technology" (technology stack isn't a user feature)
- "Scales to handle millions of users" (scalability requires load testing)
- "99.9% uptime guarantee" (reliability metrics need long-term monitoring)
- "Easy to integrate with existing systems" (integration ease isn't chat-testable)
- "Follows industry best practices" (code quality isn't user-visible functionality)

## Sources

**Documentation**
${props.documentation}

**Video transcript**
${props.transcript}
`;
};

export const claimsSchema = z.object({
  claims: z
    .array(
      z.object({
        /**
         * A concise, verb-first summary of the capability.
         * Must be 10 words or fewer.
         */
        name: z.string().describe("Concise, verb-first summary (≤ 10 words)"),

        /**
         * The full claim text (or a faithful paraphrase) plus
         * an evidence snippet (≤ 25 words) with a line/time reference.
         */
        description: z
          .string()
          .describe(
            "Full claim text with ≤ 25-word evidence snippet and line/time code"
          ),
      })
    )
    .describe(
      "List of non-duplicative, present-tense claims extracted from the sources"
    ),
});