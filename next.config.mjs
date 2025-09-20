import createMDX from '@next/mdx'
import mdxPlugins from './lib/mdx-plugins.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@mastra/core', 'jose', '@mastra/*', 'vitest', 'zod', 'ai', '@ai-sdk/*', 'playwright', 'node-web-audio-api', 'node-pty'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    turbopackPersistentCaching: true,
    useCache: true,
    useLightningcss: true,
    cssChunking: true,
    browserDebugInfoInTerminal: true,
    optimizeCss: true,
    ppr: 'incremental',
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
  options: {
    // Use the shared plugin lists. For ESM import compatibility we expect
    // lib/mdx-plugins to export default with remarkPlugins/rehypePlugins.
    remarkPlugins: mdxPlugins.remarkPlugins || [],
    rehypePlugins: mdxPlugins.rehypePlugins || [],
  },
})

export default withMDX(nextConfig)