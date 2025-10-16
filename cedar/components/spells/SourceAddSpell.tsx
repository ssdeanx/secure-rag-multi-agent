'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/cedar/components/ui/dialog'
import { Button } from '@/cedar/components/ui/button'
import Container3D from '../containers/Container3D'

interface SourceAddSpellProps {
    /** Callback when a source is added */
    onSourceAdd?: (source: { url: string; title: string }) => void
}

/**
 * SourceAddSpell
 *
 * Opens a dialog to add custom research sources.
 */
const SourceAddSpell: React.FC<SourceAddSpellProps> = ({
    onSourceAdd,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url.trim() && title.trim()) {
            const source = { url: url.trim(), title: title.trim() }
            onSourceAdd?.(source)
            setUrl('')
            setTitle('')
            setIsOpen(false)
        }
    }

    const handleCancel = () => {
        setUrl('')
        setTitle('')
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    ➕ Add Source
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Container3D>
                    <DialogHeader>
                        <DialogTitle>Add Research Source</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <label htmlFor="source-title" className="block text-sm font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    id="source-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Enter source title"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="source-url" className="block text-sm font-medium mb-2">
                                    URL
                                </label>
                                <input
                                    id="source-url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!url.trim() || !title.trim()}>
                                Add Source
                            </Button>
                        </DialogFooter>
                    </form>
                </Container3D>
            </DialogContent>
        </Dialog>
    )
}

export default SourceAddSpell
