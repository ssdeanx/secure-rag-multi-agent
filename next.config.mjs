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

const withMDX = createMDX({
    // Start with minimal MDX configuration
    options: {
        remarkPlugins: [
            'remark-gfm',
            'remark-mdx-frontmatter',
            'remark-toc',
            'remark-smartypants',
        ],
        rehypePlugins: ['rehype-mermaid'],
    },
})

export default withMDX(nextConfig)
