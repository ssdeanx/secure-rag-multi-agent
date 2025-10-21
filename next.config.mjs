import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,  // Enable gzip compression
    poweredByHeader: false,  // Remove X-Powered-By header for security
    serverExternalPackages: [
        '@mastra/core',
        'jose',
        '@mastra/*',
        'vitest',
        'zod',
        'ai',
        '@ai-sdk/*',
        'crawlee',
    ],
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    experimental: {
        //    useCache: true,
        browserDebugInfoInTerminal: true,
        optimizeCss: true,  // Enable CSS optimization for production
        // ppr: 'incremental', // Enable partial pre-rendering when stable
    },
    images: {
        domains: ['deanmachines.com', 'example.com'], // Add your image domains
        formats: ['image/webp', 'image/avif'], // Modern formats for opt
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.deanmachines.com',
            },
        ],
    },
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil',
        })
        return config
    },

    // Security and performance headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ]
    },
}

// Import plugin modules directly (avoid importing TypeScript at runtime)
// Use require.resolve to pass serializable module paths to the Next MDX loader.
// next.config.mjs is ESM, so create a CommonJS `require` via createRequire.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const remarkPlugins = [
    require.resolve('remark-frontmatter'),
    require.resolve('remark-gfm'),
    require.resolve('remark-mdx-frontmatter'),
    require.resolve('remark-toc'),
    require.resolve('remark-rehype'),
    require.resolve('remark-smartypants'),
]

const rehypePlugins = [
    require.resolve('rehype-mermaid'),
    require.resolve('rehype-prism-plus'),
    require.resolve('rehype-slug'),
    [
        require.resolve('rehype-autolink-headings'),
        {
            behavior: 'append',
            properties: {
                className: ['heading-anchor'],
            },
            content: {
                type: 'element',
                tagName: 'span',
                // use 'aria-hidden' attribute name for HTML output
                properties: { className: ['anchor-icon'], 'aria-hidden': 'true' },
                children: [{ type: 'text', value: '#' }],
            },
        },
    ],
    require.resolve('rehype-format'),
]

const withMDX = createMDX({
    options: {
        remarkPlugins,
        rehypePlugins,
    },
})

export default withMDX(nextConfig)
