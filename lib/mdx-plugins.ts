import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import remarkSmartypants from 'remark-smartypants'
import rehypeMermaid from 'rehype-mermaid'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { PluggableList } from 'unified'

// Export typed arrays for TypeScript consumers
export const remarkPlugins = [
    remarkGfm,
    remarkMdxFrontmatter,
    remarkToc,
    remarkRehype,
    remarkSmartypants,
]

// Cast through a helper to satisfy Pluggable[] typing when tuples are present
function asPluggables(arr: unknown[]): PluggableList {
    return arr as PluggableList
}

export const rehypePlugins = asPluggables([
    rehypeMermaid,
    rehypePrism,
    rehypeSlug,
    [
        rehypeAutolinkHeadings,
        {
            behavior: 'append',
            properties: {
                className: ['heading-anchor'],
            },
            content: {
                type: 'element',
                tagName: 'span',
                properties: { className: ['anchor-icon'], ariaHidden: 'true' },
                children: [{ type: 'text', value: '#' }],
            },
        },
    ],
])

export default { remarkPlugins, rehypePlugins }
