# DeanMachines.com Engineering Handbook

**Version:** 1.0.0
**Created:** 2025-10-19T14:51:00Z
**Last Updated:** 2025-10-19T14:51:00Z
**Owner:** Dean (Solo Founder)
**Domain:** deanmachines.com
**Classification:** Internal
**Reality:** Building secure, governed RAG system using Mastra framework. AI agents handle marketing/sales/ops. Goal: $10K MRR by Month 6.
**Access:** Enterprise Tier, Engineering
**Last Updated:** October 2025

## Mastra RAG Development Philosophy

**Secure RAG = Business Value:** Governed retrieval-augmented generation with role-based access control, document classification, and enterprise security. Customers get AI-powered answers, not just document search.

**Mastra Framework Core:** Using Mastra v0.21.1 for agent orchestration, workflows, and memory. PgVector for embeddings, Google Gemini for AI, Next.js for frontend.

**Solo Founder Reality:** No team, no funding. Build production-ready RAG system that enterprises trust. Prove AI + solo founder = scalable business.

## Development Workflow (Mastra + Next.js)

### Daily Rhythm

**Morning (Architecture & Security):**

- Review RAG pipeline performance (retrieval accuracy, response quality)
- Check security compliance (access controls, audit logs)
- Plan Mastra agent enhancements and workflow optimizations

**Afternoon (Implementation & Testing):**

- Develop Mastra agents, workflows, and tools
- Implement RAG security features (role-based access, document classification)
- Test with real enterprise data scenarios
- Deploy to Vercel with automated CI/CD

**Evening (Monitoring & Optimization):**

- Analyze system performance and user feedback
- Optimize vector search and AI response quality
- Plan next day's development priorities

### Mastra Development Process

**Agent-First Development:**

- Primary development: Mastra agents, workflows, and tools
- Security review: Access control and compliance validation
- Performance testing: RAG accuracy and response times
- Deployment: Automated via GitHub Actions to Vercel

**Development Criteria:**

- Does this enhance RAG security or intelligence?
- Is it maintainable in a solo-founder environment?
- Does it follow Mastra best practices?
- Performance acceptable for enterprise customers?

### Git Workflow (Production RAG System)

**Main Branch Production:**

- Direct deployments to production (Vercel auto-deploy)
- Feature flags for gradual RAG feature rollouts
- Immediate rollback if security or performance issues

**Commit Standards:**

- `agent:` New Mastra agents or agent enhancements
- `rag:` RAG pipeline improvements (retrieval, generation)
- `security:` Access control, compliance, audit features
- `workflow:` Mastra workflow optimizations
- `ui:` Frontend RAG interface improvements

## Development Workflow (Mastra + AI Agents)

### Daily Rhythm

**Morning (Strategy & Planning):**

- Review AI agent performance reports (sales conversions, marketing engagement, support tickets)
- Plan product development priorities based on customer feedback
- Check system health and AI agent status

**Afternoon (Execution & Iteration):**

- Enhance AI agent capabilities (new sales scripts, marketing content, support automation)
- Deploy updates to production (Mastra workflows, agent configurations)
- Monitor real-time business metrics (MRR, customer acquisition, churn)

**Evening (Reflection & Optimization):**

- Analyze AI agent effectiveness and ROI
- Plan next day's development priorities
- Review customer feedback and iterate

### AI Agent Development Process

**Agent-First Development:**

- Primary development: AI agent logic and workflows (Mastra framework)
- Secondary review: Me (business logic, customer impact, security)
- No human bottleneck - deploy when agents perform effectively

**Agent Criteria:**

- Does this agent solve a real customer/business problem?
- Is it maintainable by a solo developer?
- Does it follow our governed RAG security model?
- Performance impact acceptable for SaaS costs?

### Git Workflow (Simplified SaaS)

**Main Branch Deployment:**

- Direct to production deployments (Vercel auto-deploy)
- Feature flags for gradual AI agent rollouts
- Immediate rollback if business metrics decline

**Commit Standards:**

- `agent:` New or enhanced AI agents
- `workflow:` Mastra workflow improvements
- `security:` Access control and compliance updates
- `docs:` Business documentation updates

**Review Criteria:**

- Does it solve a real customer problem?
- Is it maintainable by a solo developer?
- Does it follow our AI-first patterns?
- Performance impact acceptable?

### Git Workflow (Simplified)

**Main Branch Only:**

- No complex branching - main branch deploys to production
- Feature flags for gradual rollouts
- Revert immediately if issues arise

**Commit Standards:**

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code improvements
- `docs:` Documentation updates

## Technology Stack (Mastra RAG Architecture)

### Core Mastra Framework

- **Framework:** Mastra v0.21.1 (agent orchestration, workflows, memory, MCP)
- **Frontend:** Next.js 15 + TypeScript + MUI Joy UI + Tailwind CSS
- **Backend:** Node.js with Mastra core, RAG, and evaluation modules
- **Database:** PostgreSQL with PgVector (embeddings storage and retrieval)
- **AI Models:** Google Gemini 2.5 via AI SDK (cost-effective, enterprise-grade)
- **Hosting:** Vercel with automated deployments

### Cedar OS Integration

- **Cedar OS:** Advanced UI framework for AI interactions and product roadmapping
- **Chat Components:** FloatingCedarChat, EmbeddedCedarChat, SidePanelCedarChat for multi-modal conversations
- **Voice Integration:** VoiceIndicator and audio processing components
- **Research Panel:** AI-powered research and analysis interface
- **Spells System:** Interactive UI components (RadialMenuSpell, QuestioningSpell, ResearchSpell)
- **Command Bar:** Keyboard shortcut system for power users

### Cedar UI Components

- **Roadmap Features:** RoadmapCanvas, RoadmapNode, FeatureNode for product planning
- **Chat Interface:** ChatInput, ChatRenderer, StreamingText for real-time conversations
- **Debug Tools:** DebuggerPanel, NetworkTab, StatesTab for development
- **3D Containers:** Container3D, GlassyPaneContainer for immersive experiences
- **Input Components:** TooltipMenu, ContextBadgeRow, HumanInTheLoopIndicator

### Cedar-Mastra Integration

- **Agent Communication:** Cedar OS hooks connect to Mastra agents for real-time interactions
- **Context Management:** Shared state between Cedar UI and Mastra memory systems
- **Voice Commands:** VoiceIndicator integrates with Mastra voice processing
- **Research Integration:** ResearchPanel connects to Mastra RAG for document analysis
- **Product Roadmap:** RoadmapCanvas syncs with business intelligence from Mastra agents

### Dashboard System (Dash)

- **Document Management:** Upload, view, and manage RAG documents with access controls
- **Monitoring Dashboard:** Real-time agent performance, workflow execution, and system health
- **Policy Management:** Role-based access control configuration and user management
- **Settings Panel:** API keys, model configuration, user profiles, and theme customization
- **User Administration:** Multi-tenant user management with role assignments

### Server Actions (lib/actions)

- **Authentication Actions:** Server-side auth operations with Supabase integration
- **Observability Actions:** Telemetry and monitoring data collection
- **Secure Operations:** Privileged server actions with proper validation and error handling

### Authentication System

- **Supabase Auth:** Primary authentication provider with JWT tokens and session management
- **JWT Tools:** Mastra agent authentication via jwt-auth.tool.ts for secure agent operations
- **Session Management:** Server-side session handling with cookie-based persistence
- **Role-Based Access:** Hierarchical permissions system (admin > dept_admin > dept_viewer > employee > public)

### Mastra Client Integration

- **Authenticated Client:** Frontend Mastra client with JWT authentication
- **Server Client:** Backend Mastra client for API routes and server actions
- **API Wrappers:** Logs, telemetry, observability, agents, workflows, tools, and vectors APIs
- **Error Handling:** Comprehensive error handling with MastraClientError management

### Shared Libraries (lib/)

- **Authentication Utils:** JWT utilities, session management, and Supabase helpers
- **Blog System:** MDX processing and blog content management
- **Metadata Handling:** SEO metadata generation and page optimization
- **Theme System:** Joy UI and dashboard theme configurations
- **Utility Functions:** Common helpers for data processing and formatting

### RAG Pipeline Components

- **Document Processing:** Mastra RAG for ingestion, chunking, and embedding
- **Vector Storage:** PgVector for semantic search and retrieval
- **Generation:** Google Gemini for context-aware responses
- **Security:** Role-based access control, document classification, audit logging
- **Memory:** Mastra memory system for agent persistence

### Agent Ecosystem

- **Sales Intelligence Agent:** Lead qualification, proposal generation, deal tracking
- **Compliance Advisor Agent:** Regulatory monitoring, risk assessment, audit preparation
- **Operations Optimizer Agent:** Process automation, performance monitoring, cost optimization
- **Marketing Automation:** Content generation, SEO optimization, campaign management

### Security & Governance

- **Authentication:** JWT with Supabase Auth integration
- **Access Control:** Mastra role hierarchy with document-level permissions
- **Compliance:** GDPR/CCPA ready with automated audit trails
- **Monitoring:** Real-time security alerts and compliance reporting

### Development Tools

- **Testing:** Vitest with AI-generated test cases
- **Linting:** ESLint with TypeScript strict mode
- **CI/CD:** GitHub Actions with automated deployment to Vercel
- **MCP:** Model Context Protocol for agent-tool integration

## Testing Strategy (Mastra RAG Validation)

### RAG Pipeline Testing

- **Retrieval Accuracy:** Vector search precision and recall testing
- **Generation Quality:** AI response relevance and correctness validation
- **Security Testing:** Access control and data protection verification
- **Performance Testing:** Query latency and throughput benchmarks

### Agent Testing Workflow

1. Develop Mastra agent with comprehensive test scenarios
2. Test agent capabilities with real enterprise data
3. Validate security compliance and access controls
4. Deploy with automated monitoring and rollback capability

### Quality Gates

- **Retrieval F1 Score:** >0.85 for document search accuracy
- **Response Time:** <3 seconds for AI generation
- **Security:** Zero data leakage in penetration testing
- **Uptime:** 99.9% availability with automated failover

## Deployment & Operations (Mastra RAG)

### CI/CD Pipeline

- **GitHub Actions:** Automated Mastra agent testing and deployment
- **Vercel:** Automatic deployments on main branch with environment secrets
- **Database:** Automated PgVector migrations and embedding updates
- **Monitoring:** Real-time RAG performance and security alerts

### RAG Operations

- **Vector Index Management:** Automated re-indexing for new documents
- **Model Updates:** Seamless Google Gemini model version upgrades
- **Agent Health:** Continuous monitoring of Mastra agent performance
- **Security Scanning:** Automated vulnerability assessment and compliance checks

### Incident Response (RAG-Specific)

- **Detection:** Automated monitoring of retrieval accuracy and response quality
- **Response:** Immediate rollback for security incidents or performance degradation
- **Recovery:** Automated failover to backup models or cached responses
- **Learning:** Post-mortem analysis with Mastra evaluation framework

## Security (Governed RAG Compliance)

### Authentication & Access Control

- **JWT + Supabase Auth:** Enterprise-grade authentication with role-based access
- **Document Classification:** Content-based access control (public, internal, confidential)
- **Audit Logging:** Complete user activity tracking for compliance
- **Magic Links:** Passwordless authentication for enterprise security

### Data Protection & Privacy

- **End-to-end Encryption:** Sensitive documents encrypted at rest and in transit
- **GDPR/CCPA Compliance:** Automated data subject rights and consent management
- **Data Residency:** Customer data stored in compliant geographic regions
- **Retention Policies:** Automated data lifecycle management

### RAG Security Controls

- **Input Sanitization:** Malicious prompt injection prevention
- **Output Filtering:** Sensitive information redaction in AI responses
- **Rate Limiting:** API abuse prevention with intelligent throttling
- **Model Safety:** Google Gemini safety filters and custom guardrails

## Performance Standards (RAG Excellence)

### User Experience Metrics

- **Query Response Time:** <2 seconds for document retrieval
- **AI Generation Time:** <3 seconds for contextual answers
- **Search Accuracy:** >95% relevant results in top 5
- **System Availability:** 99.9% uptime with enterprise SLA

### RAG Pipeline Performance

- **Retrieval Precision:** >90% for enterprise document search
- **Context Relevance:** >85% AI responses match user intent
- **Vector Search Latency:** <500ms for embedding similarity
- **Throughput:** 1000+ queries per minute at scale

## Growth Engineering (RAG Optimization)

### A/B Testing Framework

- **Query Optimization:** Test different retrieval strategies and ranking algorithms
- **Prompt Engineering:** Compare AI response quality across model configurations
- **UI/UX Testing:** Validate search interface effectiveness with user behavior analytics

### Analytics & Monitoring

- **RAG Metrics Dashboard:** Real-time monitoring of retrieval accuracy and user satisfaction
- **Agent Performance:** Track Mastra agent effectiveness and ROI
- **Security Analytics:** Automated threat detection and compliance reporting
- **Business Intelligence:** Revenue attribution and customer lifecycle analytics

## Scaling Strategy (Enterprise RAG)

### Current Architecture Optimization

- **Vector Database Scaling:** PgVector performance tuning for millions of documents
- **Model Optimization:** Google Gemini prompt optimization and caching strategies
- **Agent Orchestration:** Mastra workflow optimization for concurrent user load
- **Security Scaling:** Automated compliance monitoring at enterprise scale

### Future Enterprise Features

- **Multi-tenant Architecture:** Isolated customer data with shared infrastructure
- **Advanced RAG:** Hybrid search, multi-modal inputs, custom model fine-tuning
- **Global Deployment:** Multi-region hosting with data residency compliance
- **Enterprise Integrations:** SSO, audit APIs, custom security policies

## Learning & Improvement (RAG Evolution)

### Weekly RAG Review

- **Retrieval Performance:** Analyze search accuracy and user satisfaction
- **Model Effectiveness:** Evaluate Google Gemini response quality and relevance
- **Security Incidents:** Review access control effectiveness and compliance
- **Agent ROI:** Measure Mastra agent impact on business outcomes

### Tool & Framework Assessment

- **Mastra Updates:** Stay current with framework releases and new capabilities
- **AI Model Evaluation:** Compare Google Gemini versions and alternative providers
- **Security Tools:** Regular assessment of compliance and monitoring solutions
- **Performance Optimization:** Database tuning and query optimization reviews

## Emergency Procedures (RAG-Specific)

### System Outage

1. Check Vercel status and PgVector connectivity
2. Assess RAG pipeline health (retrieval vs generation)
3. Implement fallback to cached responses if available
4. Communicate with customers about expected resolution time
5. Post-mortem analysis with Mastra evaluation tools

### Security Incident

1. Isolate affected customer data and access patterns
2. Disable compromised Mastra agents or workflows
3. Conduct forensic analysis of the breach vector
4. Notify affected customers with transparency
5. Implement security improvements and compliance updates

### RAG Performance Degradation

1. Monitor vector search latency and AI response times
2. Scale database resources or implement query optimization
3. Switch to backup AI models if primary model issues
4. Communicate with customers about temporary limitations
5. Implement permanent performance improvements

## Future Scaling (Enterprise RAG)

### First Team Hire

- **When:** $50K MRR achieved with consistent growth
- **Focus:** Mastra agent development and RAG pipeline optimization
- **Onboarding:** Comprehensive security training and Mastra framework mastery

### Engineering Team Expansion

- **When:** $200K MRR achieved with enterprise customer traction
- **Structure:** Specialized roles in RAG, security, and agent development
- **Culture:** Security-first, customer-obsessed, innovation-driven

This handbook evolves with the company. As we grow from solo founder to team, we'll adapt processes while maintaining our AI-first, customer-focused approach.
