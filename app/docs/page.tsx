import React from 'react'
import { DocsLayout } from '@/components/docs/DocsLayout.joy'
import DocsHome from '@/components/docs/DocsHome.joy'

export default function DocsPage() {
  return (
    <DocsLayout>
      <DocsHome />
    </DocsLayout>
  )
}
