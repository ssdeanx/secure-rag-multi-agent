import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeMermaid from 'rehype-mermaid'

export const remarkPlugins = [
    remarkGfm,
    remarkMdxFrontmatter,
    remarkToc,
    remarkRehype,
]

export const rehypePlugins = [rehypeMermaid]

export default { remarkPlugins, rehypePlugins }
