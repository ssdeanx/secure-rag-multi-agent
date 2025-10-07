# Product Overview

## Mastra Governed RAG Template

A production-ready template for building **secure, governed RAG (Retrieval-Augmented Generation) applications** using Mastra's multi-agent orchestration framework.

### Core Purpose

Demonstrates enterprise-grade access control, document classification, and policy enforcement in AI applications. Unlike traditional RAG systems that retrieve any available document, this system ensures users only access documents they're authorized to see.

### Key Features

- **Role-Based Access Control**: JWT-based authentication with claims validation
- **Document Classification**: Automatic enforcement of public/internal/confidential classifications
- **Security-First Retrieval**: Filters applied at vector database level, not post-retrieval
- **Multi-Agent Pipeline**: Identity → Policy → Retrieve → Rerank → Answer → Verify
- **Answer Verification**: Multi-agent validation ensures no data leakage

### Target Use Cases

- Healthcare (HIPAA compliance, patient record access)
- Financial Services (SOX, PCI-DSS compliance)
- Legal (attorney-client privilege, confidential case files)
- Government (classified information, clearance-level access)
- Enterprise (HR policies, intellectual property protection)

### Demo Scenarios

- Finance Employee: Access to finance policies and public documents only
- Engineering Manager: Access to engineering handbook and public documents
- HR Admin with Step-Up: Access to ALL documents including confidential data
