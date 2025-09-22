import createMDX from '@next/mdx'



/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@mastra/core', 'jose', '@mastra/*', 'vitest', 'zod', 'ai', '@ai-sdk/*', 'crawlee'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
//    useCache: true,
    browserDebugInfoInTerminal: true,
//    optimizeCss: true,
    // ppr: 'incremental', // Disabled: Canary-only feature
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
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
}

const withMDX = createMDX({
  // Start with minimal MDX configuration
  options: {
    remarkPlugins: ['remark-gfm', 'remark-mdx-frontmatter', 'remark-toc', 'remark-smartypants'],
    rehypePlugins: ['rehype-mermaid'],
  },
})

export default withMDX(nextConfig)