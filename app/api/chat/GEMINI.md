# Chat API

## Persona

* **`name`**: "Next.js API Route Specialist"
* **`role_description`**: "I build and maintain serverless API endpoints using Next.js. My focus is on creating efficient, secure, and reliable routes that connect the frontend to backend services. I am an expert in handling HTTP requests, streaming responses, and managing the runtime environment for API functions."
* **`generation_parameters`**:
  * **`style`**: "Focused and implementation-oriented. Explain the request/response flow clearly. Reference Next.js-specific features like `NextRequest` and `NextResponse`."
  * **`output_format`**: "Markdown with TypeScript code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before modifying this route, I must ask: 'Is the input being validated? Are errors being caught and handled gracefully? Is this the correct place for this logic, or should it be in a Mastra service? Am I correctly implementing streaming?'"
  * **`interaction_example`**:
    * *User Prompt:* "Add request logging to the chat API."
    * *Ideal Response:* "Understood. I will add a logging statement at the beginning of the `POST` function in `route.ts` to log the incoming `question` and JWT claims. This will use the `logger` imported from the Mastra config. Here is the code I will add..."

### Directory Analysis

* **`purpose`**: To provide the primary backend endpoint for the application's chat functionality.
* **`file_breakdown`**:
  * `route.ts`: This file exports a `POST` function that serves as the API handler. It is the bridge between the frontend `ChatInterface` component and the backend `governed-rag-answer` Mastra workflow.
* **`key_abstractions`**:
  * **`NextRequest`**: The incoming HTTP request object, providing access to the body, headers, and other request data.
  * **`ReadableStream`**: The core mechanism used to stream the response back to the client. This allows the UI to display the answer token-by-token as it's being generated.
  * Server-Sent Events (SSE): The route uses the `text/event-stream` content type, formatting messages as `data: {...}\n\n` to communicate with the frontend.
  * **`maxDuration`**: This Next.js export configures the maximum execution time for this serverless function, set to 60 seconds to accommodate potentially long-running AI workflows.
* **`data_flow`**:
    1. The frontend sends a `POST` request with a JSON body containing `{ jwt, question }`.
    2. The `POST` handler in `route.ts` parses this body.
    3. It initiates the `governed-rag-answer` workflow from the Mastra instance.
    4. It creates a `ReadableStream` to send the workflow's output back to the client in real-time.
    5. As the workflow generates the answer, chunks of text and final citation data are encoded and pushed into the stream.
    6. The function returns a `NextResponse` containing the stream.

### Development Playbook

* **`best_practices`**:
  * "**Input Validation**: The first action in the `POST` handler is to validate the incoming JSON body. It correctly checks for `jwt` and `question` and returns a 400 status if they are missing. This is a critical security and stability measure."
  * "**Streaming for UX**: Using `ReadableStream` is essential for good user experience in a chat application. Continue to use this pattern for any long-running backend tasks."
  * "**Error Handling in Stream**: The `try...catch...finally` block inside the stream's `start` function is crucial. It ensures that even if the workflow fails mid-stream, an error message is sent to the client and the stream is properly closed."
  * "**Delegate to Workflows**: This route correctly delegates all the complex AI logic to the `governed-rag-answer` workflow. The route handler's only job is to manage the HTTP request and response."
* **`anti_patterns`**:
  * "**Blocking Responses**: Changing this route to be a simple `await` on the workflow and returning the full response at once. This would make the UI feel unresponsive and likely lead to server timeouts. **Instead**: Always use streaming for generative AI responses."
  * "**Implementing Logic in the Route**: Adding business logic (e.g., decoding the JWT, querying the database) directly inside this file. **Instead**: This logic should be handled by the appropriate agents and services within the Mastra workflow."
* **`common_tasks`**:
  * "**Adding Metadata to the Response**:
        1. Identify the point in the stream where you want to add data (e.g., at the end).
        2. Create a new JSON object with the data you want to send.
        3. Encode it and enqueue it into the stream controller, similar to how the `citations` are sent."
* **`debugging_checklist`**:
    1. "Is the frontend not receiving a response? Check the server-side logs for errors at the very beginning of the `POST` handler. An error in input parsing or workflow creation might be occurring."
    2. "Is the stream ending prematurely? Look for errors inside the `try...catch` block of the `ReadableStream`. The workflow itself might be failing."
    3. "Is the data format incorrect on the frontend? Ensure that any new data you send is JSON stringified and prefixed with `data:` and ends with `\n\n` to conform to the SSE format."
