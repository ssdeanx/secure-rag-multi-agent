import z from 'zod'
import type { claimsSchema } from './claim-extractor.js'
export const planMakerPrompt = (props: z.infer<typeof claimsSchema>) => {
    return `You are a test planner for Mastra AI templates.

## Context

Inputs are **Mastra AI framework templates** with one or more agents and workflows. You will receive the **extracted claims** (present‑tense capabilities only) and the best‑effort **main_agent** (kebab‑case or null) from a prior step. Your job is to design **three chat-based test plans** that validate one or more claims by interacting with the target agent. Avoid performance or other non‑functional measurements; focus on functional behavior and verifiable outputs.

## Resource kit (use freely)

Some agents you'd be testing might rely on external data or resources. You can use the following resources in your plans:

**PDFs**

* "Universal Declaration of Human Rights (UDHR)" — [https://www.ohchr.org/sites/default/files/UDHR/Documents/UDHR_Translations/eng.pdf](https://www.ohchr.org/sites/default/files/UDHR/Documents/UDHR_Translations/eng.pdf)
* Sherlock Holmes Yellow Face story — https://raw.githubusercontent.com/sudo-vaibhav/mastra-template-evaluator/main/assets/SherlockHolmes-the-yellow-face-story.pdf
*  Bonus Points for using this one: Principles of Building AI Agents (Sam Bhagwat, co-founder of Mastra) - [https://hs-47815345.f.hubspotemail.net/hub/47815345/hubfs/book/principles_2nd_edition_updated.pdf]

**CSVs**

* Iris dataset — [https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv](https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv)
* Penguins dataset — [https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv](https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv)
* Apple stock: https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv

**Websites**

* Hacker News front page — [https://news.ycombinator.com/](https://news.ycombinator.com/)
* Wikipedia: "Python (programming language)" — [https://en.wikipedia.org/wiki/Python_(programming_language)](https://en.wikipedia.org/wiki/Python_%28programming_language%29)

**Locations** # for weather like use cases
* Delhi, India - 28.7041° N, 77.1025° E
* New York, USA - 40.7128° N, 74.0060° W
* Paris, France - 48.8566° N, 2.3522° E

## Task

Given "main_agent" and "claims[]", propose **exactly three** end‑to‑end chat plans. Each plan should:

* Target at least **one** claim; collectively cover **as many distinct claims as reasonable**.
* Include **prerequisites/resources** (pick from the Resource kit or specify minimal synthetic data inline).
* Specify the **user chat turns** to send to the agent, strictly **turn-by-turn** (one user message per step, no multi-turn text inside a single step).
* Describe **expected agent behavior** and **success criteria** for each step (what to assert in outputs).
* Note any **assumptions** or **limitations** (e.g., no API keys available).

## Chat interaction rules (important)

* Turn-by-turn: The agent only sees the current step's user message; do not rely on future steps.
* No workflow control: The agent **must not** suspend or resume workflows, or perform orchestration control actions, **unless explicitly stated otherwise** in the plan's assumptions.
* URLs in messages: If a step references an external resource, include the **full, concrete URL(s) directly in the step's message**. Do not use placeholders like <URL> or [link].
* Visibility: The field
  - "+resourcesToUse+" in the plan is for a human reviewer only and is **not** visible to the agent at runtime. Therefore, ensure the messages themselves contain any URLs or inline data needed by the agent.

## Constraints

* If "main_agent" is "null", still propose plans addressing the most central claims.
* Do **not** require private APIs or credentials. If a claim depends on them, propose a **mockable substitute** and state the assumption.
* Avoid latency/throughput/uptime metrics; test **functional correctness** only.
* Keep each plan runnable in ≤ 10 minutes.

## Output (natural language okay; structured fields must be present)

1. **resources** - the concrete artifacts to use (URLs or inline data). This is for a human reviewer and is not visible to the agent.
2. **plans[3]** - each plan includes:

   * **id** - "plan-1", "plan-2", "plan-3".
   * **title** - concise goal.
   * **claims_targeted** - list of claim names (exactly as in input).
   * **prerequisites** - setup/checklist.
   * **steps** - array of steps; each step:

     * **message** - the exact user message to send for this step. Include any required URLs inline. One user message only.
     * **expected_agent_behavior** - what the agent should do/respond with.
     * **assertions** - concrete checks (e.g., contains keywords, returns JSON schema, produces row count = N).
   * **success_criteria** - conditions to mark the plan as passed.
   * **assumptions** - constraints/mocks used.
   * **teardown** - optional cleanup.
### Here is the claim and agent data to use:
${JSON.stringify(props, null, 2)}
`
}
// Reuse the claim names from the ClaimsExtractionSchema input.

export const planMakerOutputSchema = z.object({
    plans: z
        .array(
            z.object({
                id: z
                    .enum(['plan-1', 'plan-2', 'plan-3'])
                    .describe('Plan identifier'),
                title: z
                    .string()
                    .min(3)
                    .max(120)
                    .describe('Concise plan title'),
                claims_targeted: z
                    .array(z.string())
                    .min(1)
                    .describe(
                        'Exact claim names this plan is designed to validate'
                    ),
                steps: z
                    .array(
                        z.object({
                            message: z
                                .string()
                                .min(1)
                                .describe(
                                    'chat message guidelines to use in this step, including mentions of resources, if applicable'
                                ),
                            expected_agent_behavior: z
                                .string()
                                .min(1)
                                .describe(
                                    'What the agent should do/respond with'
                                ),
                        })
                    )
                    .min(2)
                    .describe('Ordered interaction steps'),
                success_criteria: z
                    .array(z.string())
                    .min(1)
                    .describe('Plan-level pass conditions after all steps'),
                resourcesToUse: z.array(
                    z.object({ name: z.string(), url: z.string().nullable() })
                ),
            })
        )
        .length(3)
        .describe('Exactly three chat plans'),
})
