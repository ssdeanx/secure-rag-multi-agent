'use client'

import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
} from '@/components/ui/joy'
import { ChevronRight } from '@mui/icons-material'

interface TocItem {
    id: string
    title: string
    level: number
}

interface DocsTOCProps {
    items?: TocItem[]
}

export function DocsTOC({ items = [] }: DocsTOCProps) {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -80% 0px' }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            observer.disconnect()
        }
    }, [items])

    const handleClick = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 80
            const elementPosition =
                element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            })
        }
    }

    if (items.length === 0) {
        return null
    }

    return (
        <Box
            component="nav"
            sx={{
                position: 'sticky',
                top: 96,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
                pr: 2,
            }}
        >
            <Typography
                level="body-xs"
                sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: 'text.secondary',
                    mb: 2,
                }}
            >
                On This Page
            </Typography>

            <List sx={{ '--List-padding': '0px', '--List-gap': '4px' }}>
                {items.map((item) => (
                    <ListItem
                        key={item.id}
                        sx={{ '--ListItem-paddingY': '0px' }}
                    >
                        <ListItemButton
                            onClick={() => handleClick(item.id)}
                            selected={activeId === item.id}
                            sx={{
                                pl: (item.level - 2) * 2,
                                py: 0.75,
                                borderRadius: 'sm',
                                fontSize: 'sm',
                                fontWeight: activeId === item.id ? 600 : 400,
                                color:
                                    activeId === item.id
                                        ? 'primary.500'
                                        : 'text.secondary',
                                borderLeft:
                                    activeId === item.id
                                        ? '2px solid'
                                        : '2px solid transparent',
                                borderColor: 'primary.500',
                                '&:hover': {
                                    bgcolor: 'neutral.softHoverBg',
                                    color: 'primary.500',
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'primary.softBg',
                                },
                            }}
                        >
                            {activeId === item.id && (
                                <ChevronRight sx={{ fontSize: 16, mr: 0.5 }} />
                            )}
                            {item.title}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
