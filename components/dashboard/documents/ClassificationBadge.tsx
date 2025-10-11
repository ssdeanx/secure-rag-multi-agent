'use client'

import * as React from 'react'
import Chip from '@mui/joy/Chip'
import type { ColorPaletteProp } from '@mui/joy/styles'

/**
 * Classification Badge Props
 */
interface ClassificationBadgeProps {
    classification: 'public' | 'internal' | 'confidential'
}

/**
 * Classification Badge Component
 *
 * Visual indicator for document security classification.
 */
export default function ClassificationBadge({ classification }: ClassificationBadgeProps) {
    const colorMap: Record<string, ColorPaletteProp> = {
        public: 'success',
        internal: 'warning',
        confidential: 'danger'
    }

    const labelMap: Record<string, string> = {
        public: 'Public',
        internal: 'Internal',
        confidential: 'Confidential'
    }

    return (
        <Chip size="sm" variant="soft" color={colorMap[classification]}>
            {labelMap[classification]}
        </Chip>
    )
}
