'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import LinearProgress from '@mui/joy/LinearProgress'
import Stack from '@mui/joy/Stack'
import Alert from '@mui/joy/Alert'
import {
    CloudUpload,
    CheckCircle,
    Error as ErrorIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

/**
 * Upload State Type
 */
type UploadState = 'idle' | 'uploading' | 'success' | 'error'

/**
 * DocumentUploader Component
 *
 * Drag & drop file upload interface with classification selection.
 */
export default function DocumentUploader() {
    const router = useRouter()
    const [state, setState] = React.useState<UploadState>('idle')
    const [classification, setClassification] =
        React.useState<string>('internal')
    const [progress, setProgress] = React.useState(0)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [dragActive, setDragActive] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files !== null && e.dataTransfer.files.length > 0) {
            void handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files !== null && e.target.files.length > 0) {
            void handleFiles(e.target.files)
        }
    }

    const handleFiles = async (files: FileList) => {
        const file = files[0]
        if (file === undefined) {
            return
        }

        // Validate file type
        if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
            setErrorMessage(
                'Only Markdown files (.md, .markdown) are supported'
            )
            setState('error')
            return
        }

        setState('uploading')
        setProgress(0)
        setErrorMessage('')

        try {
            // Create form data
            const formData = new FormData()
            formData.append('file', file)
            formData.append('classification', classification)

            // Upload with progress tracking
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    setProgress((e.loaded / e.total) * 100)
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    setState('success')
                    setTimeout(() => {
                        router.push('/protected/dash/documents')
                    }, 2000)
                } else {
                    setState('error')
                    setErrorMessage('Upload failed. Please try again.')
                }
            })

            xhr.addEventListener('error', () => {
                setState('error')
                setErrorMessage('Network error. Please check your connection.')
            })

            xhr.open('POST', '/api/documents/upload')
            xhr.send(formData)
        } catch {
            setState('error')
            setErrorMessage('An unexpected error occurred')
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <Stack spacing={3}>
            {/* Classification Selection */}
            <Card>
                <CardContent>
                    <FormControl>
                        <FormLabel>Security Classification</FormLabel>
                        <Select
                            value={classification}
                            onChange={(_event, value) => {
                                if (value !== null) {
                                    setClassification(value)
                                }
                            }}
                            disabled={state === 'uploading'}
                        >
                            <Option value="public">
                                Public - Accessible to everyone
                            </Option>
                            <Option value="internal">
                                Internal - Employees only (default)
                            </Option>
                            <Option value="confidential">
                                Confidential - Restricted access
                            </Option>
                        </Select>
                        <Typography
                            level="body-xs"
                            sx={{ mt: 0.5, color: 'text.secondary' }}
                        >
                            Select the appropriate security level for this
                            document
                        </Typography>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Upload Zone */}
            <Card
                variant={dragActive ? 'soft' : 'outlined'}
                color={dragActive ? 'primary' : 'neutral'}
                sx={{
                    position: 'relative',
                    cursor: state === 'uploading' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: state === 'uploading' ? 0.7 : 1,
                }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={state === 'uploading' ? undefined : handleButtonClick}
            >
                <CardContent sx={{ py: 8, textAlign: 'center' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,.markdown"
                        onChange={handleChange}
                        disabled={state === 'uploading'}
                        aria-label="Upload document file"
                        hidden
                    />

                    {state === 'idle' && (
                        <>
                            <CloudUpload
                                sx={{
                                    fontSize: 64,
                                    color: 'text.secondary',
                                    mb: 2,
                                }}
                            />
                            <Typography level="h4" sx={{ mb: 1 }}>
                                Drop files here or click to browse
                            </Typography>
                            <Typography
                                level="body-sm"
                                sx={{ color: 'text.secondary' }}
                            >
                                Supports .md and .markdown files
                            </Typography>
                        </>
                    )}

                    {state === 'uploading' && (
                        <Box>
                            <CloudUpload
                                sx={{
                                    fontSize: 64,
                                    color: 'primary.500',
                                    mb: 2,
                                }}
                            />
                            <Typography level="h4" sx={{ mb: 2 }}>
                                Uploading...
                            </Typography>
                            <LinearProgress
                                determinate
                                value={progress}
                                sx={{ maxWidth: 400, mx: 'auto' }}
                            />
                            <Typography
                                level="body-sm"
                                sx={{ mt: 1, color: 'text.secondary' }}
                            >
                                {Math.round(progress)}% complete
                            </Typography>
                        </Box>
                    )}

                    {state === 'success' && (
                        <>
                            <CheckCircle
                                sx={{
                                    fontSize: 64,
                                    color: 'success.500',
                                    mb: 2,
                                }}
                            />
                            <Typography level="h4" sx={{ mb: 1 }}>
                                Upload successful!
                            </Typography>
                            <Typography
                                level="body-sm"
                                sx={{ color: 'text.secondary' }}
                            >
                                Redirecting to documents...
                            </Typography>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <ErrorIcon
                                sx={{
                                    fontSize: 64,
                                    color: 'danger.500',
                                    mb: 2,
                                }}
                            />
                            <Typography level="h4" sx={{ mb: 1 }}>
                                Upload failed
                            </Typography>
                            <Typography
                                level="body-sm"
                                sx={{ color: 'text.secondary', mb: 2 }}
                            >
                                {errorMessage}
                            </Typography>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setState('idle')
                                    setProgress(0)
                                    setErrorMessage('')
                                }}
                            >
                                Try Again
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Information Alert */}
            <Alert variant="soft" color="primary">
                <Typography level="body-sm">
                    Documents will be automatically chunked and indexed for RAG
                    retrieval. The indexing process may take a few minutes
                    depending on document size.
                </Typography>
            </Alert>
        </Stack>
    )
}
