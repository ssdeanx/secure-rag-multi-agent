# 🔐 Multi-Agent AI Orchestration System

![Logo](public/logo_128.png)

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-blue?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-green?style=flat&logo=typescript)
![Mastra](https://img.shields.io/badge/Mastra-0.21.1-orange?style=flat)
![Vitest](https://img.shields.io/badge/Vitest-3.2.4-red?style=flat&logo=vitest)
![Node](https://img.shields.io/badge/Node-%3E=20.19.5-blue?style=flat&logo=node.js)
![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-blue?style=flat&logo=google)
![OpenAI](https://img.shields.io/badge/OpenAI-API-blue)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-blue)
![Lucide React](https://img.shields.io/badge/Lucide%20React-Icons-yellow)
![MUI Joy UI](https://img.shields.io/badge/MUI%20Joy%20UI-Components-indigo)
![Docker](https://img.shields.io/badge/Docker-Container-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=flat&logo=postgresql)
![Mermaid](https://img.shields.io/badge/Mermaid-Diagrams-blue)
![Voice](https://img.shields.io/badge/Voice-Google%20Gemini-green)
![MCP](https://img.shields.io/badge/MCP-Integration-purple)

A comprehensive multi-agent AI orchestration platform featuring secure Retrieval-Augmented Generation (RAG), advanced research capabilities, voice interactions, MCP integration, and sophisticated memory management using Mastra AI framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

A comprehensive multi-agent AI orchestration platform that combines secure Retrieval-Augmented Generation (RAG) with advanced research capabilities, web scraping, content analysis, voice interactions, MCP integration, and sophisticated memory management. Built with enterprise-grade security featuring hierarchical RBAC, document classification, and multi-agent security pipelines to ensure users only access authorized corporate knowledge while enabling powerful AI-driven research and analysis workflows.

### Key Features

- **Hierarchical RBAC**: Roles inherit access (public → employee → dept viewer/admin → admin)
- **Document Classification**: Public/internal/confidential with tag-based filtering
- **Multi-Agent Orchestration**: 20+ specialized agents for research, analysis, content creation, and security
- **Advanced Research**: Web scraping, multi-phase research workflows, and content evaluation
- **Voice Integration**: Google Gemini Live voice capabilities for conversational AI
- **MCP Integration**: Model Context Protocol support for enhanced agent capabilities
- **Secure RAG**: Enterprise-grade retrieval with access controls and audit trails
- **Advanced Memory**: Persistent memory with semantic recall and working memory templates
- **Content Analysis**: Learning extraction, evaluation scoring, and quality assessment
- **Audit-Ready**: Citations, logs, and compliance validation throughout

### Architecture

```mermaid
graph TD

    user["User<br>/app"]
    external_llm["External LLM/RAG Service<br>/llms.txt"]
    external_data["External Data Sources<br>/corpus"]
    subgraph mastra_rag_system["Mastra Governed RAG System<br>[External]"]
        subgraph web_app["Web Application<br>/app"]
            ui_components["UI Components<br>/components/ui"]
            pages["Pages<br>/app"]
            navigation["Navigation & Layout<br>/app/layout.tsx"]
            mdx_renderer["MDX Renderer<br>/components/mdx"]
            %% Edges at this level (grouped by source)
            pages["Pages<br>/app"] -->|"Uses"| ui_components["UI Components<br>/components/ui"]
            pages["Pages<br>/app"] -->|"Uses"| navigation["Navigation & Layout<br>/app/layout.tsx"]
            mdx_renderer["MDX Renderer<br>/components/mdx"] -->|"Uses"| ui_components["UI Components<br>/components/ui"]
        end
        subgraph backend_api["Backend API<br>/lib"]
            auth_service["Authentication Service<br>/lib/auth.ts"]
            rag_orchestrator["RAG Orchestrator<br>/lib/mastra"]
            api_endpoints["API Endpoints<br>/app/api"]
            data_processing["Data Processing<br>/lib/utils.ts"]
            %% Edges at this level (grouped by source)
            api_endpoints["API Endpoints<br>/app/api"] -->|"Uses"| auth_service["Authentication Service<br>/lib/auth.ts"]
            api_endpoints["API Endpoints<br>/app/api"] -->|"Invokes"| rag_orchestrator["RAG Orchestrator<br>/lib/mastra"]
            rag_orchestrator["RAG Orchestrator<br>/lib/mastra"] -->|"Uses"| data_processing["Data Processing<br>/lib/utils.ts"]
        end
        subgraph document_store["Document Store<br>/corpus"]
            document_storage["Document Storage<br>/corpus"]
            indexing_service["Indexing Service<br>[External]"]
            retrieval_service["Retrieval Service<br>[External]"]
            %% Edges at this level (grouped by source)
            indexing_service["Indexing Service<br>[External]"] -->|"Reads from"| document_storage["Document Storage<br>/corpus"]
            retrieval_service["Retrieval Service<br>[External]"] -->|"Queries"| indexing_service["Indexing Service<br>[External]"]
        end
        subgraph cli_app["CLI Application<br>/src/cli"]
            cli_commands["CLI Commands<br>/src/cli"]
            cli_core["CLI Core<br>/src/index.ts"]
            %% Edges at this level (grouped by source)
            cli_core["CLI Core<br>/src/index.ts"] -->|"Dispatches to"| cli_commands["CLI Commands<br>/src/cli"]
        end
        %% Edges at this level (grouped by source)
        web_app["Web Application<br>/app"] -->|"Makes API calls to | HTTPS/JSON"| backend_api["Backend API<br>/lib"]
        backend_api["Backend API<br>/lib"] -->|"Retrieves documents from"| retrieval_service["Retrieval Service<br>[External]"]
        cli_app["CLI Application<br>/src/cli"] -->|"Interacts with | API Calls"| backend_api["Backend API<br>/lib"]
        cli_app["CLI Application<br>/src/cli"] -->|"Ingests data into"| indexing_service["Indexing Service<br>[External]"]
    end
    %% Edges at this level (grouped by source)
    backend_api["Backend API<br>/lib"] -->|"Queries | API Calls"| external_llm["External LLM/RAG Service<br>/llms.txt"]
    external_data["External Data Sources<br>/corpus"] -->|"Provides documents to"| document_storage["Document Storage<br>/corpus"]
    user["User<br>/app"] -->|"Uses | HTTPS"| web_app["Web Application<br>/app"]
```

**Research & Analysis Pipeline:**

```mermaid
flowchart TD
    %% Research Input
    A[Research Query] --> B[Research Agent<br/>Query Decomposition<br/>Multi-phase Planning]

    %% Initial Research Phase
    B --> C[Web Scraping Tools<br/>Site Mapping, Content Extraction<br/>Batch Processing]

    %% Analysis Phase
    C --> D[Content Analysis<br/>Learning Extraction<br/>Evaluation Scoring]

    %% Follow-up Research
    D --> E[Iterative Research<br/>Follow-up Queries<br/>Depth Analysis]

    %% Synthesis Phase
    E --> F[Content Synthesis<br/>Report Generation<br/>Validation]

    %% Output
    F --> G[Research Report<br/>With Citations & Sources]

    %% Supporting Tools
    subgraph H["Research Tools"]
        I[Web Scraper<br/>Content Extraction]
        J[Evaluator<br/>Quality Assessment]
        K[Learning Extractor<br/>Insight Mining]
        L[Graph RAG<br/>Knowledge Graph]
    end

    %% Tool Integration
    B -.-> I
    C -.-> J
    D -.-> K
    E -.-> L

    %% Styling for Dark Mode
    classDef darkMode fill:#1e1e1e,stroke:#ffffff,stroke-width:2px,color:#ffffff
    class A,B,C,D,E,F,G,H darkMode
```

**Secure RAG Pipeline:**

```mermaid
flowchart TD
    %% Input Layer
    A[User Query + JWT] --> B[Identity Agent<br/>JWT Validation & User Context]

    %% Security Layer
    B --> C[Policy Agent<br/>Role-Based Access Control<br/>Document Classification Filtering]

    %% Retrieval Layer
    C --> D[Retrieve Agent<br/>PgVector Similarity Search<br/>Security-Filtered Results]

    %% Processing Layer
    D --> E[Rerank Agent<br/>Relevance Scoring<br/>Context Ranking]

    %% Generation Layer
    E --> F[Answerer Agent<br/>Secure Response Generation<br/>Citation Assembly]

    %% Verification Layer
    F --> G[Verifier Agent<br/>Compliance Validation<br/>PII Detection<br/>Policy Enforcement]

    %% Output Layer
    G --> H[Secure Response<br/>With Citations & Metadata]

    %% Multi-Agent Enhancement
    I[Research Content Network<br/>Multi-Source Analysis] -.-> F
    J[Governed RAG Network<br/>Cross-Agent Coordination] -.-> G

    %% Supporting Components
    subgraph K["Available Tools (12 total)"]
        L[Vector Query Tool<br/>Secure Similarity Search]
        M[Document Chunking Tool<br/>Intelligent Text Splitting]
        N[Web Scraper Tool<br/>Content Extraction]
        O[JWT Auth Tool<br/>Token Validation]
        P[Content Tools<br/>Copywriter, Editor, Evaluation]
        Q[Data Tools<br/>Weather, Roadmap, File Manager]
    end

    %% Tool Usage
    D -.-> L
    D -.-> M
    F -.-> P
    I -.-> N
    I -.-> Q
    B -.-> O

    %% Styling for Dark Mode
    classDef darkMode fill:#1e1e1e,stroke:#ffffff,stroke-width:2px,color:#ffffff
    class A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q darkMode
```

## Getting Started

### Prerequisites

- Node.js >=20.9.0
- Docker and Docker Compose
- Git
- OpenAI API key

### Quick Setup

1. **Clone and install:**

    ```bash
    git clone https://github.com/ssdeanx/governed-rag-ai.git
    cd mastra-governed-rag
    npm install
    ```

2. **Configure environment:**

    ```bash
    cp .env.example .env
    # Edit .env with your API keys and other settings:
    # - OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY (required for AI models)
    # - SERPAPI_API_KEY (optional, for web search tools - get from https://serpapi.com/manage-api-key)
    # - SUPABASE credentials (required for authentication)
    # - DATABASE_URL (required for PostgreSQL)
    ```

3. **Set up authentication (Supabase):**

    This application uses Supabase for user authentication. You need to:

    a. **Create a Supabase project** at [https://supabase.com/dashboard](https://supabase.com/dashboard)

    b. **Get your credentials** from Project Settings:
    - `SUPABASE_URL` - Your project URL (e.g., `https://xxxxx.supabase.co`)
    - `SUPABASE_ANON_KEY` - Your anon/public key

    c. **Update your `.env` file** with Supabase credentials:

    ```bash
    SUPABASE_URL="https://your-project.supabase.co"
    SUPABASE_ANON_KEY="your_anon_key_here"
    NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
    ```

    d. **Configure GitHub OAuth** (optional):
    - In Supabase Dashboard: Authentication > Providers > GitHub
    - Add your GitHub OAuth app credentials
    - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
    - Update `.env` with `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

    📖 **See [docs/AUTH_ARCHITECTURE.md](docs/AUTH_ARCHITECTURE.md) for detailed authentication documentation.**

4. **Start database (optional):**

    ```bash
    # Only needed if using local PostgreSQL
    docker-compose up -d db
    ```

5. **Index documents:**

    ```bash
    npm run cli index
    ```

6. **Start development:**

    ```bash
    npm run dev  # http://localhost:3000
    ```

### AI & Research Capabilities

- **Multi-Agent Orchestration**: 20+ specialized agents for research, analysis, content creation, and security
- **Advanced Research Workflows**: Multi-phase research with web scraping, content evaluation, and learning extraction
- **Secure Vector Search**: Filtered retrieval based on user permissions with PgVector
- **Content Analysis**: Automated learning extraction, quality evaluation, and insight mining
- **Web Search & Data Collection**: SerpAPI-powered Google Search, News, Trends, Shopping (Amazon, Walmart, eBay, Home Depot), Academic (Google Scholar), Finance, and Local Business (Yelp) searches
- **Web Scraping Tools**: Comprehensive web content extraction and processing
- **Contextual Reranking**: Relevance scoring with security constraints
- **Citation Generation**: Source attribution with access verification
- **Voice Integration**: Google Gemini Live voice capabilities for conversational AI
- **MCP Integration**: Model Context Protocol support for enhanced agent tools
- **Advanced Memory**: Persistent memory with semantic recall and working memory templates
- **Quality Assurance**: Automated evaluation scoring and compliance validation
- **Streaming Responses**: Real-time answer generation with SSE

## AI Agents

This system employs a comprehensive multi-agent architecture with 20+ specialized agents:

### Core RAG Agents

- **Identity Agent** - Validates user authentication and permissions
- **Policy Agent** - Enforces access control and security policies
- **Retrieve Agent** - Performs intelligent document retrieval with security filtering
- **Rerank Agent** - Ranks and scores retrieved documents for relevance
- **Answerer Agent** - Generates secure responses with citations
- **Verifier Agent** - Validates responses for compliance and accuracy

### Specialized Agents

- **Research Agent** - Conducts in-depth research and analysis
- **Report Agent** - Generates structured reports and summaries
- **Copywriter Agent** - Creates marketing and communication content
- **Evaluation Agent** - Assesses content quality and relevance
- **Learning Extraction Agent** - Identifies and extracts key learnings
- **Product Roadmap Agent** - Analyzes product strategy and roadmaps
- **Editor Agent** - Reviews and improves content quality
- **Self-Referencing Agent** - Maintains context across conversations
- **Assistant Agent** - Provides general AI assistance
- **Starter Agent** - Handles initial query processing
- **Voice Agent** - Manages voice-based interactions and audio processing
- **MCP Agent** - Integrates with Model Context Protocol tools
- **Template Reviewer Agent** - Reviews and validates templates and workflows

### Network Agents

- **Research Content Network** - Orchestrates multi-agent research workflows
- **Governed RAG Network** - Manages secure RAG operations across agents

Each agent follows a single-tool-call policy, ensuring predictable and auditable AI behavior while maintaining security governance throughout the entire pipeline.

## Research & Analysis Features

Beyond secure RAG, this system provides comprehensive research and analysis capabilities:

### Multi-Phase Research Workflows

- **Query Decomposition**: Breaking down complex research questions into focused search queries
- **Web Content Extraction**: Advanced web scraping with site mapping and content cleaning
- **Content Evaluation**: Automated assessment of information quality and relevance
- **Learning Extraction**: AI-powered identification and extraction of key insights
- **Iterative Research**: Follow-up research based on initial findings
- **Report Synthesis**: Structured report generation with citations and sources

### Advanced Analysis Tools

- **Graph RAG Queries**: Complex knowledge graph-based retrieval and analysis
- **Content Quality Scoring**: Automated evaluation using LLM-based scorers
- **Semantic Memory**: Persistent context with working memory templates
- **Compliance Validation**: PII detection and policy enforcement
- **Multi-Source Synthesis**: Combining information from diverse sources

### Research Agent Example

```typescript
// Research agent with multi-phase workflow
const researchAgent = new Agent({
    name: 'Research Agent',
    instructions: `
        PHASE 1: Deconstruct topic into focused search queries
        PHASE 2: Web scraping and content extraction  
        PHASE 3: Content evaluation and learning extraction
        PHASE 4: Follow-up research and synthesis
    `,
    tools: {
        webScraperTool, evaluateResultTool, extractLearningsTool,
        graphRagQueryTool, mdocumentChunker
    },
    memory: pgMemory,
    scorers: {
        relevancy: createAnswerRelevancyScorer(),
        safety: createToxicityScorer()
    }
})
```

## AI Tools

The system includes 12 specialized tools that agents can invoke to perform specific operations:

### Core RAG Tools

- **Vector Query Tool** - Performs secure vector similarity searches with access filtering
- **JWT Auth Tool** - Validates and processes JWT tokens for user authentication
- **Document Chunking Tool** - Intelligently splits documents into manageable chunks for indexing with metadata extraction
- **Graph RAG Query Tool** - Executes complex graph-based retrieval augmented generation queries

### Content & Analysis Tools

- **Copywriter Agent Tool** - Generates marketing and communication content
- **Editor Agent Tool** - Reviews and improves content quality and clarity
- **Evaluate Result Tool** - Assesses the quality and relevance of generated content
- **Extract Learnings Tool** - Identifies and extracts key insights and learnings
- **Starter Agent Tool** - Handles initial query processing and routing

### Research & Data Tools

- **Web Scraper Tool** - Extracts and processes web content for research
- **Weather Tool** - Provides weather data and forecasting capabilities
- **Roadmap Tool** - Analyzes product strategy and roadmap information
- **Data File Manager** - Manages file operations and data processing tasks

### Core RAG Workflows

- **Governed RAG Answer Workflow** - Main workflow for secure question answering with citations
- **Governed RAG Index Workflow** - Handles document indexing with classification and security tagging
- **Chat Workflow** - Manages conversational interactions with context preservation

### Specialized Workflows

- **Research Workflow** - Conducts comprehensive research operations across multiple sources
- **Content Generation Workflow** - Creates various types of content using multiple agents
- **Generate Report Workflow** - Produces structured reports and analytical summaries
- **Template Reviewer Workflow** - Reviews and validates templates and workflows with claim extraction, planning, and scoring

### Supporting Workflows

- **Chat Workflow Types** - Type definitions and utilities for chat operations
- **Chat Workflow Shared Types** - Common types and interfaces for workflow communication

All workflows implement comprehensive error handling, tracing, and security validation at each step, ensuring reliable and auditable AI operations.

## AI Services

The system includes 13 specialized services that handle business logic and integrations:

### Core Services

- **Authentication Service** - Manages user authentication and session handling
- **Role Service** - Handles role-based access control and permissions
- **Validation Service** - Provides data validation and sanitization
- **Rate Limiting Service** - Implements API rate limiting and throttling

### Document & Content Services

- **Document Indexing Service** - Manages document indexing and metadata
- **Document Processor Service** - Processes and transforms documents
- **Chunking Service** - Handles intelligent text chunking strategies
- **Embedding Service** - Manages vector embeddings generation

### Data & Storage Services

- **Vector Query Service** - Provides vector similarity search capabilities
- **Vector Storage Service** - Manages vector database operations
- **Tier Management Service** - Handles subscription tiers and feature access

### Workflow Services

- **Workflow Decorators** - Provides decorators for workflow enhancement

## Data Schemas

The system uses Zod schemas for comprehensive data validation:

- **Agent Schemas** - Validation schemas for all agent inputs and outputs
- **Workflow Schemas** - Type-safe workflow definitions and contracts
- **API Schemas** - Request/response validation for all endpoints

## Access Control Policy

Security policies are defined in `src/mastra/policy/acl.yaml` with hierarchical role-based access:

### Role-Based Access Control

```text
admin (100) > dept_admin (80) > dept_viewer (60) > employee (40) > public (10)
```

### Document Access Control

```yaml
docs:
    - path: './corpus/finance-policy.md'
      allow:
          roles: ['finance.viewer', 'finance.admin']
          tiers: ['pro', 'enterprise']
      tenant: 'acme'
      classification: 'internal'

    - path: './corpus/hr-confidential.md'
      allow:
          roles: ['hr.admin', 'admin']
          tiers: ['enterprise']
      tenant: 'acme'
      classification: 'confidential'
```

### Feature Tiers

- **Free**: Basic RAG capabilities, public docs access
- **Pro**: Internal docs, advanced analytics, custom integrations
- **Enterprise**: Confidential docs, white-label, on-premise deployment

- **Type-Safe Development**: Full TypeScript with Zod schema validation
- **Hot Reload**: Concurrent development for frontend and backend
- **Comprehensive Testing**: Vitest framework with service and workflow tests
- **Docker Integration**: Containerized development environment
- **Extensive Documentation**: Complete API references and guides

## Project Structure

```bash
mastra-governed-rag/
├── app/                    # Next.js routes and API endpoints
├── components/             # React UI components
├── cedar/                  # Cedar OS interactive components
├── corpus/                 # Sample documents for indexing
├── docs/                   # Comprehensive documentation
├── src/
│   ├── mastra/            # Core Mastra implementation
│   │   ├── agents/        # AI agents (20+ specialized agents for research, analysis, security)
│   │   ├── workflows/     # Orchestrated agent workflows (10 workflows for research, RAG, content)
│   │   ├── tools/         # Reusable agent tools (12 tools for web scraping, analysis, search)
│   │   ├── services/      # Business logic and integrations (13 services)
│   │   ├── networks/      # Multi-agent orchestration networks
│   │   ├── schemas/       # Data validation schemas (Zod)
│   │   ├── config/        # Configuration and external services
│   │   └── policy/        # Access control policies and ACL
│   └── cli/               # Command-line interface
├── lib/                    # Shared utilities and client libraries
└── docker-compose.yml     # Development services
```

## Usage Examples

### Research Query with Multi-Phase Analysis

```typescript
// Advanced research with web scraping and analysis
const researchRequest = {
    question: "What are the latest developments in AI agent orchestration frameworks?",
    researchDepth: 3, // Multi-phase research
    includeWebSources: true,
    evaluationRequired: true
}

// Response includes:
// - Multi-source web research
// - Content evaluation scores
// - Extracted learnings and insights
// - Citations and source validation
// - Structured synthesis report
```

### Secure RAG Query with Authentication

```typescript
// Generate JWT for a finance viewer
const jwt = generateDemoJWT('finance')

// Query the system
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        jwt,
        question: 'What is the expense reimbursement policy?',
    }),
})

const result = await response.json()
// Returns secure answer with citations
```

### Role-Based Access Demonstration

```bash
# Test different user roles
npm run cli query "$(npm run jwt:finance)" "What are expense approval thresholds?"
npm run cli query "$(npm run jwt:hr)" "What is executive compensation policy?"
npm run cli query "$(npm run jwt:public)" "What is our company mission?"
```

> [!NOTE]
> Each role sees different results based on their access level. See [Demo Roles](./docs/demo-roles.md) for complete examples.

## API Reference

### Core Endpoints

- `POST /api/chat` - Secure RAG queries with streaming responses
- `POST /api/index` - Document indexing with classification
- `GET /api/auth/*` - Authentication endpoints

### Request/Response Format

```typescript
// Chat request
{
  "jwt": "eyJhbGciOiJIUzI1NiIs...",
  "question": "What is the company policy on X?"
}

// Streaming response
data: {"content": "According to the policy..."}
data: {"done": true, "citations": [...]}
```

For complete API documentation, see [API Reference](./docs/api-reference.md).

## Development

### Local Development

```bash
# Start all services
npm run dev  # Frontend + Mastra backend

# Individual services
npm run dev:next   # Next.js only
npm run dev:mastra # Mastra only
```

### Testing

```bash
# Run all tests
npm test

# CLI operations
npm run cli index    # Index documents
npm run cli query    # Test queries
npm run cli demo     # Interactive demo
```

### Code Quality

```bash
# Linting and formatting
npm run lint
npm run pretty
```

## Deployment

### Docker Deployment

```bash
# Build and run
docker-compose up -d
```

### Production Considerations

- Configure production environment variables
- Set up proper JWT secrets
- Enable audit logging
- Configure PostgreSQL + PgVector for production scale

## Security Model

### Role Hierarchy

```text
admin (100) > dept_admin (80) > dept_viewer (60) > employee (40) > public (10)
```

### Document Classifications

- **Public**: General information accessible to all
- **Internal**: Department-specific content for employees
- **Confidential**: Highly sensitive data requiring elevated access

### Access Control

Policies are defined in `src/mastra/policy/acl.yaml` with role-based and tier-based access control:

```yaml
docs:
    - path: './corpus/finance-policy.md'
      allow:
          roles: ['finance.viewer', 'finance.admin']
          tiers: ['pro', 'enterprise']
      tenant: 'acme'
      classification: 'internal'

    - path: './corpus/hr-confidential.md'
      allow:
          roles: ['hr.admin', 'admin']
          tiers: ['enterprise']
      tenant: 'acme'
      classification: 'confidential'
```

### Feature Access Tiers

- **Free**: Basic RAG, public docs
- **Pro**: Internal docs, advanced analytics, custom integrations
- **Enterprise**: Confidential docs, white-label, on-premise deployment

## Resources

- [Full Documentation](./docs/index.md)
- [Architecture Guide](./docs/architecture.md)
- [Security Implementation](./docs/security.md)
- [API Reference](./docs/api-reference.md)
- [Mastra Framework](https://mastra.ai)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Troubleshooting

### Common Issues

#### PostgreSQL Connection Failed

```bash
# Check PostgreSQL status
docker-compose ps

# Check logs
docker-compose logs db

# Restart database
docker-compose down && docker-compose up -d
```

#### Authentication Errors

```bash
# Regenerate JWT tokens
npm run jwt:finance  # or other roles
```

#### No Search Results

- Verify document indexing: `npm run cli index`
- Check user role permissions
- Review PgVector collection status

For detailed troubleshooting, see [Troubleshooting Guide](./docs/troubleshooting.md).

## Roadmap

- Multi-tenant support
- Advanced reranking algorithms
- Integration with additional LLM providers
- Enhanced audit and compliance features
- Performance optimizations for large document sets

---

Built with ❤️ using [Mastra](https://mastra.ai) • [Next.js](https://nextjs.org) • [PostgreSQL](https://postgresql.org)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by Mastra Community. Questions? Open an issue.

---
