#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const docsDir = path.join(process.cwd(), 'docs')

function findNonMdx(dir) {
  const bad = []
  const items = fs.readdirSync(dir)
  for (const name of items) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      bad.push(...findNonMdx(full))
    } else if (!/\.mdx$/i.test(name) && /\.md$/i.test(name)) {
      bad.push(full)
    }
  }
  return bad
}

const bad = findNonMdx(docsDir)
if (bad.length === 0) {
  console.log('All docs .mdx or non-md files are OK')
  process.exit(0)
} else {
  console.error('Found .md files that should be converted to .mdx:')
  bad.forEach((b) => console.error('  -', b))
  process.exit(2)
}
