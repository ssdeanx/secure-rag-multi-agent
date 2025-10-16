'use client'

import React, { useEffect, useState } from 'react'
import { TooltipMenu, type TooltipMenuItem } from '@/cedar/components/inputs/TooltipMenu'

interface ResearchSpellProps {
    /** Callback when research is triggered */
    onResearch?: (selectedText: string) => void
}

/**
 * ResearchSpell
 *
 * Shows a tooltip menu when text is selected with a research option.
 */
const ResearchSpell: React.FC<ResearchSpellProps> = ({
    onResearch,
}) => {
    const [selectedText, setSelectedText] = useState('')
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection()
            const text = selection?.toString()?.trim() ?? ''

            if (text && text.length > 0) {
                // Get the range and position
                const range = selection?.getRangeAt(0)
                if (range) {
                    const rect = range.getBoundingClientRect()
                    setMenuPosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 10
                    })
                    setSelectedText(text)
                }
            } else {
                setMenuPosition(null)
                setSelectedText('')
            }
        }

        const handleClick = () => {
            // Close menu on any click
            setMenuPosition(null)
            setSelectedText('')
        }

        document.addEventListener('selectionchange', handleSelection)
        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('selectionchange', handleSelection)
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const menuItems: TooltipMenuItem[] = [
        {
            title: 'Research this text',
            icon: '🔍',
            onInvoke: () => {
                if (selectedText) {
                    onResearch?.(selectedText)
                }
            }
        }
    ]

    if (!menuPosition || !selectedText) {
        return null
    }

    return (
        <TooltipMenu
            position={menuPosition}
            items={menuItems}
            onClose={() => {
                setMenuPosition(null)
                setSelectedText('')
            }}
        />
    )
}

export default ResearchSpell
