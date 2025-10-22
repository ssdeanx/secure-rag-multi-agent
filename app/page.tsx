import { Hero } from '@/components/landing/Hero.joy'
import type { NodeDef } from '@/components/landing/SystemDiagram.joy';
import SystemDiagram from '@/components/landing/SystemDiagram.joy'
import CapabilitiesShowcase from '@/components/landing/CapabilitiesShowcase.joy'
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures.joy'
import { NewsletterForm } from '@/components/landing/NewsletterForm.joy'
import { CTA } from '@/components/landing/CTA.joy'

export default function Home() {
    const systemNodes: NodeDef[] = [
        {
            id: 'agents',
            title: 'Agents (27)',
            color: 'primary',
            bullets: [
                {
                    text: 'Core agents',
                    children: [
                        'identity (auth & roles)',
                        'policy (ACL & classification)',
                        'retrieve (vector + filters)',
                        'rerank (score & bias-check)'
                    ]
                },
                {
                    text: 'Specialist agents',
                    children: [
                        'financial-analysis (stock/crypto)',
                        'research (ArXiv + web)',
                        'copywriter & editor',
                        'report & evaluation'
                    ]
                },
                'assistant & starter agents',
            ],
        },

        {
            id: 'tools',
            title: 'Secure Tools (25+)',
            color: 'success',
            bullets: [
                {
                    text: 'Financial integrations',
                    children: ['Alpha Vantage', 'Finnhub', 'Polygon']
                },
                {
                    text: 'Research & scraping',
                    children: ['SerpAPI (search/news/academic)', 'ArXiv connector', 'Web Scraper + PDF parsing']
                },
                'Vector store (PgVector)',
                'JWT auth & role tools',
            ],
        },

        {
            id: 'workflows',
            title: 'Workflows (8+)',
            color: 'danger',
            bullets: [
                'governed-rag-index (indexing with classification)',
                'governed-rag-answer (secure answering)',
                'financial-analysis (V1/V2/V3)',
                'research-workflow & generate-report',
            ],
        },

        {
            id: 'networks',
            title: 'Agent Networks (3)',
            color: 'info',
            bullets: [
                'governed-rag-network (RAG orchestration)',
                'financial-team-network (market analysis)',
                'research-content-network (papers -> summaries)',
            ],
        },

        {
            id: 'storage',
            title: 'Storage & Memory',
            color: 'primary',
            bullets: [
                'Postgres + PgVector (embeddings & metadata)',
                'LibSQL/Memory for long-term task memory',
                'Masked logging & token limiters for safety',
            ],
        },

        {
            id: 'security',
            title: 'Security & Policy',
            color: 'success',
            bullets: [
                'Role hierarchy & RBAC (see role-hierarchy.ts)',
                'ACL rules (src/mastra/policy/acl.yaml)',
                'Audit trails & Langfuse tracing',
            ],
        },

        {
            id: 'observability',
            title: 'Observability',
            color: 'info',
            bullets: [
                'Evals & performance scorers',
                'Langfuse exporters & sensitive data filters',
                'Structured logs & metrics',
            ],
        },
    ]

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto w-full px-4">
                <SystemDiagram nodes={systemNodes} centerText="Secure Enterprise AI Platform" />
            </div>
            <Hero />
            <div className="max-w-7xl mx-auto w-full px-4">
                <InteractiveFeatures />
                <CapabilitiesShowcase />
                <NewsletterForm />
                <CTA />
            </div>
        </div>
    )
}
