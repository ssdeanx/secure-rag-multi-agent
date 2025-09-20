import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@mastra/core', 'jose', '@mastra/*', 'vitest', 'zod', 'ai', '@ai-sdk/*'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    useCache: true,
    useLightningcss: true,
    cssChunking: true,
    browserDebugInfoInTerminal: true,
    optimizeCss: true,
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
    remarkPlugins: ['remark-gfm', 'remark-mdx-frontmatter', 'remark-toc', 'remark-rehype', 'remark-html', 'remark-mdx', 'remark-parse', 'remark-stringify', 'remark-frontmatter', 'remark-smartypants'],
    rehypePlugins: ['rehype-mermaid'],
  },
})

export default withMDX(nextConfig)