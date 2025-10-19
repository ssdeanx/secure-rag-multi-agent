# DeanMachines.com Technical Specifications

**Version:** 1.0.0  
**Created:** 2025-10-19T15:06:00Z  
**Last Updated:** 2025-10-19T15:06:00Z  
**Owner:** Dean (Solo Founder)  
**Domain:** deanmachines.com  
**Classification:** Internal  
**Stack:** Next.js 15 + Mastra AI + PostgreSQL/PgVector + Google Gemini + TypeScript
**Access:** Pro/Enterprise Users, Engineering
**Last Updated:** October 2025

## System Architecture

**Deployment Model:**

- Cloud-native SaaS (Vercel + Supabase)
- Single-tenant architecture (current)
- Multi-tenant planned for Q1 2026

**Technology Stack:**

- Frontend: Next.js 15, React, TypeScript, Tailwind CSS
- Backend: Node.js, Mastra AI framework
- Database: PostgreSQL + PgVector (Supabase)
- AI: Google Gemini 2.5 Flash
- Hosting: Vercel (frontend), Supabase (database)
- Authentication: Supabase Auth

## API Specifications

**REST API:**

- Base URL: `https://api.deanmachines.com/v1`
- Authentication: Bearer tokens (JWT from Supabase)
- Rate Limiting: Tier-based (100-10,000 requests/day)
- Format: JSON

**Key Endpoints:**

- `POST /chat` - Submit questions, get AI answers
- `POST /documents` - Upload and index documents
- `GET /documents` - List user's documents
- `GET /analytics` - Basic usage statistics

**Rate Limits (Current):**

- Free: 100 requests/day
- Starter: 500 requests/day
- Professional: 5,000 requests/day
- Enterprise: 10,000 requests/day

**Real-time Features:**

- Streaming responses via Server-Sent Events
- Live document processing status

## AI Capabilities & Agent Ecosystem

**Core RAG Pipeline:**

- Document ingestion and chunking
- Vector embeddings (Google text-embedding-004, 3072 dimensions)
- Semantic search with relevance ranking
- AI-powered answer generation
- Multi-agent orchestration through Mastra networks

**Implemented Tools (30+ specialized tools):**

**Financial & Market Intelligence:**

- Alpha Vantage API integration (stock data)
- Finnhub tools (market data, news)
- Polygon tools (financial data)
- Crypto analysis tools
- Stock analysis tools

**Research & Content:**

- ArXiv academic paper search
- SERP API integrations (academic, news, trends, shopping, search)
- Web scraper tools
- Document chunking and processing
- PDF data conversion

**Business Intelligence:**

- Competitive intelligence gathering
- Sales data analysis
- Process analysis and optimization
- Compliance checking
- JWT authentication tools

**Content & Creative:**

- Copywriter agent tools
- Editor agent tools
- Evaluation and learning extraction
- Roadmap generation tools

**Data Management:**

- Vector query tools
- Graph RAG query capabilities
- Data file manager
- CSV to Excalidraw conversion
- Image to CSV processing

**Utility Tools:**

- Weather data integration
- Starter agent tools
- Template reviewer tools

**Implemented Agents (25+ specialized agents):**

**Core RAG Agents:**

- Retrieve agent (document retrieval)
- Rerank agent (result ranking)
- Answerer agent (response generation)
- Verifier agent (answer validation)
- Identity agent (user context)

**Business & Operations:**

- Sales intelligence agent
- Compliance advisor agent
- Operations optimizer agent
- Product roadmap agent
- Report generation agent

**Financial & Market:**

- Crypto analysis agent
- Stock analysis agent
- Market education agent
- Financial analysis workflows

**Content & Creative:**

- Copywriter agent
- Editor agent
- Evaluation agent
- Learning extraction agent

**Research & Analysis:**

- Research agent
- Assistant agent
- MCP (Model Context Protocol) agent

**Specialized Processing:**

- CSV to Excalidraw converter
- Image to CSV processor
- Excalidraw validator
- Voice agent (planned)

**Multi-Agent Networks (6 orchestrated networks):**

**Business Intelligence Network:**

- Sales intelligence + competitive analysis
- Market research + trend analysis
- Customer insights + opportunity identification

**Customer Lifecycle Network:**

- Lead generation + qualification
- Customer onboarding + support
- Retention + expansion opportunities

**Financial Team Network:**

- Market analysis + investment research
- Risk assessment + portfolio optimization
- Financial reporting + compliance

**Governed RAG Network:**

- Document retrieval + answer generation
- Quality verification + security enforcement
- Audit trails + compliance monitoring

**Product Development Network:**

- Feature ideation + prioritization
- Technical feasibility + implementation planning
- User feedback + iteration cycles

**Research Content Network:**

- Academic research + industry analysis
- Content synthesis + knowledge extraction
- Trend identification + strategic insights

## Document Processing

**Supported Formats (Current):**

- Text: TXT, MD
- Web: URL scraping (basic)
- Code: Most programming languages
- Future: PDF, DOCX, structured data

**Maximum File Sizes (Current):**

- Free: 10MB per file
- Starter: 50MB per file
- Professional: 100MB per file
- Enterprise: 500MB per file

**Processing Pipeline:**

1. File upload and validation
2. Text extraction (basic parsing)
3. Document chunking (fixed 512-token chunks)
4. Embedding generation (Google text-embedding-004)
5. Vector storage in PgVector
6. Basic metadata indexing

**Chunking Strategy (Current):**

- Fixed size: 512 tokens with 50 token overlap
- Simple text splitting (no semantic boundaries yet)
- Future: Intelligent chunking with semantic awareness

## Vector Search

**Embedding Model:**

- Google gemini-embedding-001    (3072 dimensions)
- Context window: 8192 tokens
- Hosted via Google AI API

**Search Algorithm (Current):**

- Cosine similarity search
- Basic relevance ranking
- No reranking or hybrid search yet

**Query Processing (Current):**

- Direct question → embedding → vector search → answer generation
- No query expansion or multi-step reasoning yet
- Single-shot answers from retrieved context

## Access Control

**Authentication (Current):**

- Supabase Auth (email/password, OAuth)
- JWT tokens with role claims
- Session management via cookies

**Authorization (Basic - Current):**

- User-based document access
- No advanced RBAC yet
- Future: Role-based permissions, document-level access control

**Security Features (Current):**

- HTTPS everywhere
- Basic input validation
- API key rotation (manual)
- Future: Audit logging, advanced encryption

**Audit Logging (Planned):**

- Basic query logging (when implemented)
- No compliance features yet
- Future: SOC 2 compliance, detailed audit trails

## Security Features

**Data Encryption:**

- At rest: AES-256
- In transit: TLS 1.3
- Key management: AWS KMS / Azure Key Vault

**Authentication:**

- SSO via SAML 2.0
- OAuth 2.0 / OpenID Connect
- Multi-factor authentication (MFA)
- API keys with rotation

**Network Security:**

- VPC isolation
- Private endpoints available
- IP allowlisting
- DDoS protection (CloudFlare)

## Performance Characteristics

**Query Latency (Current):**

- Simple queries: <3 seconds p95
- Complex queries: <5 seconds p95
- First response: <2 seconds (streaming)

**Scalability (Current):**

- Single Vercel instance
- Supabase database (managed PostgreSQL)
- No horizontal scaling yet
- Future: Multi-region, auto-scaling

**Uptime SLA (Current):**

- Best effort (Vercel + Supabase uptime)
- No formal SLA yet
- Future: 99.9% uptime guarantee

## Integration Capabilities

**Native Integrations (Current):**

- Google Drive (basic file access)
- OneDrive (planned)
- Future: Slack, Teams, Confluence

**API Access:**

- REST API for all features
- Streaming responses
- Webhook support (planned)

**SDK Availability (Future):**

- JavaScript/TypeScript SDK
- Python SDK
- REST API for other languages

## Data Residency

**Regions Available:**

- US (East, West)
- EU (Ireland, Frankfurt)
- Asia Pacific (Singapore, Tokyo)

**Data Sovereignty:**

- Customer data stays in chosen region
- Cross-region replication optional (Enterprise)
- Backup locations configurable

## Compliance Certifications

**Current Status:**

- SOC 2 Type II: In progress (Q1 2026)
- GDPR: Basic compliance (data residency in EU available)
- CCPA: Basic compliance

**Security Measures (Current):**

- Data encryption at rest (Supabase)
- HTTPS for all connections
- Basic access controls
- Future: Advanced audit logging, data classification

---

**Maintained By:** Engineering Team
**Technical Questions:** engineering@deanmachines.com
