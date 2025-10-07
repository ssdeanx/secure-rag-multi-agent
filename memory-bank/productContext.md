# Product Context

**Updated:** 2025-09-30

## Why This Project Exists

### The Problem

Traditional RAG (Retrieval-Augmented Generation) systems and AI platforms face multiple challenges:

1. **Data Leakage**: Sensitive information exposed to unauthorized users in RAG systems
2. **Compliance Violations**: Regulatory requirements not met for corporate data access
3. **Audit Gaps**: No tracking of who accessed what information
4. **Trust Issues**: Organizations reluctant to use AI with confidential data
5. **Integration Complexity**: Difficult to combine multiple AI capabilities (RAG, research, content generation)
6. **Limited Public Presence**: No marketing site or documentation for potential users
7. **Scattered Capabilities**: Research, content creation, RAG exist as separate systems

### The Solution

Mastra Governed RAG is a **multi-agent AI platform** that combines:

#### Secure RAG System

- **Hierarchical RBAC**: 10-role hierarchy with inheritance (admin → dept admins → dept viewers → employee → reader → public)
- **Document Classification**: Public/internal/confidential levels with ACL policies
- **6-Agent Security Pipeline**: Identity → Policy → Retrieve → Rerank → Answer → Verifier
- **Audit Trails**: Complete logging with Langfuse observability

#### Research Capabilities

- Multi-phase research workflows with web scraping
- Suspend/resume for human-in-loop review
- Learning extraction and evaluation agents
- Structured report generation

#### Content Creation

- Copywriter agent for various content types (blog, marketing, technical, business)
- Editor agent for content refinement
- Report generation from research findings

#### Public Website

- Marketing landing page with hero, features, CTAs
- MDX-powered blog for updates and insights
- Comprehensive documentation with search
- Contact and about pages

#### Developer Platform

- 16 specialized AI agents
- 9 orchestrated workflows
- 11 reusable tools
- Dual authentication (JWT and Supabase)
- lib/ bridge layer for API-backend separation

## How It Should Work

### User Experience Flow

1. **Authentication**: User logs in with JWT token containing role claims
2. **Query Submission**: User asks a question via chat interface
3. **Security Validation**: System validates identity and determines access level
4. **Document Retrieval**: Only authorized documents are searched
5. **Answer Generation**: AI generates response with citations
6. **Verification**: Security checks confirm appropriate access
7. **Response Display**: User sees answer with source attribution

### Key Interactions

#### For Regular Users

- Submit natural language questions
- Receive contextual answers with citations
- View their current access level
- See which documents contributed to answers

#### For Administrators

- Index new documents with classification
- Monitor system health and performance
- Review audit logs and access patterns
- Configure role-based policies

#### For Developers

- Integrate custom agents and tools
- Extend workflow orchestration
- Add new document sources
- Customize security policies

## User Experience Goals

### Primary Goals

1. **Security-First**: Users trust the system with sensitive data
2. **Transparency**: Clear indication of access levels and sources
3. **Performance**: Fast, responsive interactions
4. **Reliability**: Consistent, accurate answers
5. **Auditability**: Complete tracking for compliance

### Secondary Goals

- Seamless integration with existing identity systems
- Extensible architecture for custom requirements
- Developer-friendly APIs and documentation
- Observable system behavior for debugging

## Target Audience and Personas

### Persona 1: Knowledge Worker (Emma)

- **Role**: Employee in Finance Department
- **Goals**: Find accurate answers to policy questions quickly
- **Needs**: Access to finance and general company documents
- **Pain Points**: Time wasted searching multiple systems
- **Success Metric**: Reduces search time from 15 minutes to 30 seconds

### Persona 2: Department Administrator (David)

- **Role**: HR Department Manager
- **Goals**: Ensure team accesses appropriate HR information
- **Needs**: Control over departmental content, audit capabilities
- **Pain Points**: Difficulty managing document access across tools
- **Success Metric**: 100% compliance with HR data regulations

### Persona 3: System Administrator (Sarah)

- **Role**: IT Security Lead
- **Goals**: Maintain system security and compliance
- **Needs**: Complete audit trails, flexible policy configuration
- **Pain Points**: Limited visibility into AI-powered systems
- **Success Metric**: Pass all security audits with zero violations

### Persona 4: Integration Developer (Marcus)

- **Role**: Backend Engineer
- **Goals**: Integrate RAG with internal applications
- **Needs**: Clear APIs, good documentation, extensibility
- **Pain Points**: Complex security models hard to implement
- **Success Metric**: Complete integration in 2 days vs. 2 weeks

### Persona 5: Research Analyst (Jessica)

- **Role**: Market Research Analyst
- **Goals**: Conduct multi-phase research with AI assistance
- **Needs**: Web scraping, structured research workflows, human review checkpoints
- **Pain Points**: Manual research takes days, lacks structure
- **Success Metric**: Complete comprehensive research in hours vs. days

### Persona 6: Content Creator (Alex)

- **Role**: Marketing Content Writer
- **Goals**: Generate and refine high-quality content efficiently
- **Needs**: AI-powered copywriting and editing tools
- **Pain Points**: Writer's block, inconsistent quality, manual editing
- **Success Metric**: Produce 5x more content with consistent quality

### Persona 7: Product Manager (Rachel)

- **Role**: Product Team Lead
- **Goals**: Manage product roadmap and feature prioritization
- **Needs**: Interactive roadmap visualization, feature tracking
- **Pain Points**: Roadmap updates scattered across tools
- **Success Metric**: Single source of truth for product roadmap

### Persona 8: Prospective User (Tom)

- **Role**: CTO evaluating AI platforms
- **Goals**: Understand platform capabilities before committing
- **Needs**: Documentation, blog posts, demo access
- **Pain Points**: Unclear value proposition, lack of technical details
- **Success Metric**: Confident purchase decision within 1 day of discovery

## Key Features and Use Cases

### Feature 1: Secure Document Retrieval

**Use Case**: Employee queries "What is our expense approval policy?"

- System validates employee role
- Searches only public and internal documents
- Filters out confidential content
- Returns policy with citations
- Logs access event

### Feature 2: Step-Up Authentication

**Use Case**: Manager needs confidential salary information

- System detects confidential content requirement
- Prompts for elevated authentication
- Validates manager role with additional claims
- Grants temporary elevated access
- Logs privileged access event

### Feature 3: Document Classification

**Use Case**: Administrator indexes new HR policy

- CLI accepts document with classification tags
- Generates embeddings with security metadata
- Stores in vector database with access rules
- Makes available to appropriate roles only
- Confirms successful indexing

### Feature 4: Audit Logging

**Use Case**: Compliance officer reviews access logs

- System provides complete audit trail
- Shows who accessed what content when
- Includes security decisions and reasoning
- Exports logs for compliance reporting
- Supports forensic investigation

### Feature 5: Multi-Phase Research Workflows

**Use Case**: Research analyst investigates market trends

- User initiates research workflow with topic
- Web scraper tool gathers data from sources
- Research agent performs multi-phase analysis
- Workflow suspends for human review checkpoints
- Learning extraction agent identifies key insights
- Report agent compiles structured findings
- Complete research delivered in hours vs. days

### Feature 6: AI-Powered Content Generation

**Use Case**: Marketing team creates blog post

- Copywriter agent generates initial draft
- Content follows brand voice and technical accuracy
- Editor agent refines and polishes content
- Evaluation agent assesses quality metrics
- Final content ready for publication
- 5x productivity increase over manual writing

### Feature 7: Public Documentation & Blog

**Use Case**: Prospective user evaluates platform

- Visitor browses public website (/, /about, /blog, /docs)
- Reads MDX blog posts about features and updates
- Accesses comprehensive documentation
- Views interactive demos (/demo-rag)
- Contacts team via form (/contact)
- Makes informed purchase decision

### Feature 8: Multi-Agent Security Pipeline

**Use Case**: System processes any user query

1. **Identity Agent**: Validates JWT and extracts claims
2. **Policy Agent**: Generates access filters based on role
3. **Retrieve Agent**: Searches with security constraints
4. **Rerank Agent**: Scores relevance with access validation
5. **Answerer Agent**: Generates secure response
6. **Verifier Agent**: Final compliance check

## Product Values

1. **Security First**: Never compromise on access control, even as platform expands
2. **Transparency**: Users understand what they can access and why
3. **Compliance**: Meet regulatory requirements by design
4. **Performance**: Security and orchestration shouldn't slow down users
5. **Extensibility**: Easy to adapt to specific needs and add new agents
6. **Developer Experience**: Clear APIs, excellent documentation, rapid integration
7. **Quality**: AI-generated content meets professional standards
8. **Accessibility**: Public resources available to everyone

## Success Indicators

**Security & Compliance**:

- Users trust the system with sensitive questions
- Zero unauthorized data access incidents
- 100% audit compliance in security reviews

**Performance**:

- <2 second response time for queries
- Research workflows complete in hours vs. days
- Content generation 5x faster than manual writing

**User Satisfaction**:

- 95%+ satisfaction with answer quality
- 90%+ satisfaction with research insights
- 85%+ satisfaction with generated content quality

**Platform Adoption**:

- Public website traffic growing month-over-month
- Documentation accessed by prospective users
- Integration developers complete setup in <2 days
- Active community engagement in blog comments
