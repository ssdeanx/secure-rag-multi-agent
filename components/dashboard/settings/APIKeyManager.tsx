'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import IconButton from '@mui/joy/IconButton'
import Alert from '@mui/joy/Alert'
import Divider from '@mui/joy/Divider'
import {
    Visibility,
    VisibilityOff,
    Save,
    Warning,
    CheckCircle,
} from '@mui/icons-material'

interface APIKey {
    id: string
    label: string
    description: string
    envVar: string
    required: boolean
}

const apiKeys: APIKey[] = [
    {
        id: 'gemini',
        label: 'Google Gemini API Key',
        description: 'Required for Gemini AI model access',
        envVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
        required: true,
    },
    {
        id: 'openai',
        label: 'OpenAI API Key',
        description: 'Optional - for OpenAI model fallback',
        envVar: 'OPENAI_API_KEY',
        required: false,
    },
]

/**
 * API Key Manager Component
 *
 * Secure interface for managing API keys with masked display
 * and validation. Keys are stored securely in environment variables.
 */
export default function APIKeyManager() {
    const [keys, setKeys] = React.useState<Record<string, string>>({})
    const [visibleKeys, setVisibleKeys] = React.useState<Record<string, boolean>>({})
    const [saving, setSaving] = React.useState(false)
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Load existing keys (masked) on mount
    React.useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await fetch('/api/settings/api-keys')
                if (response.ok) {
                    const data = await response.json() as { keys?: Record<string, string> }
                    setKeys(data.keys ?? {})
                }
            } catch (error) {
                // Silently fail - keys might not be set yet
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                setMessage({ type: 'error', text: `Failed to load keys: ${errorMessage}` })
            }
        }
        fetchKeys()
    }, [])

    const handleToggleVisibility = (keyId: string) => {
        setVisibleKeys((prev) => ({
            ...prev,
            [keyId]: !prev[keyId],
        }))
    }

    const handleKeyChange = (keyId: string, value: string) => {
        setKeys((prev) => ({
            ...prev,
            [keyId]: value,
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        try {
            const response = await fetch('/api/settings/api-keys', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keys }),
            })

            if (!response.ok) {
                throw new Error('Failed to save API keys')
            }

            setMessage({ type: 'success', text: 'API keys saved successfully' })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Security Warning */}
            <Alert
                startDecorator={<Warning />}
                variant="soft"
                color="warning"
            >
                <Box>
                    <Typography level="title-sm">Security Notice</Typography>
                    <Typography level="body-sm">
                        API keys are sensitive credentials. Never share them publicly or commit them to version control.
                        They are encrypted and stored securely.
                    </Typography>
                </Box>
            </Alert>

            {/* API Keys */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 3 }}>
                        AI Service Keys
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {apiKeys.map((apiKey) => (
                            <Box key={apiKey.id}>
                                <FormControl required={apiKey.required}>
                                    <FormLabel>
                                        {apiKey.label}
                                        {apiKey.required && (
                                            <Typography component="span" sx={{ color: 'danger.main', ml: 0.5 }}>
                                                *
                                            </Typography>
                                        )}
                                    </FormLabel>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Input
                                            type={visibleKeys[apiKey.id] ? 'text' : 'password'}
                                            value={keys[apiKey.id] || ''}
                                            onChange={(e) => handleKeyChange(apiKey.id, e.target.value)}
                                            placeholder={`Enter your ${apiKey.label}`}
                                            sx={{ flex: 1 }}
                                            endDecorator={
                                                keys[apiKey.id] && (
                                                    <IconButton
                                                        size="sm"
                                                        variant="plain"
                                                        color="neutral"
                                                        onClick={() => handleToggleVisibility(apiKey.id)}
                                                    >
                                                        {visibleKeys[apiKey.id] ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                )
                                            }
                                        />
                                    </Box>
                                    <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.tertiary' }}>
                                        {apiKey.description}
                                    </Typography>
                                </FormControl>
                                {apiKey.id !== apiKeys[apiKeys.length - 1].id && (
                                    <Divider sx={{ mt: 3 }} />
                                )}
                            </Box>
                        ))}
                    </Box>

                    {/* Success/Error Message */}
                    {message && (
                        <Alert
                            startDecorator={message.type === 'success' ? <CheckCircle /> : <Warning />}
                            variant="soft"
                            color={message.type === 'success' ? 'success' : 'danger'}
                            sx={{ mt: 3 }}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => {
                                setKeys({})
                                setVisibleKeys({})
                            }}
                        >
                            Clear All
                        </Button>
                        <Button
                            variant="solid"
                            color="primary"
                            loading={saving}
                            startDecorator={<Save />}
                            onClick={handleSave}
                        >
                            Save API Keys
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Database Configuration */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Database Configuration
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.tertiary', mb: 2 }}>
                        Database credentials are managed through environment variables for security.
                        Contact your system administrator to update these settings.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <FormLabel>Database URL</FormLabel>
                            <Input
                                value="postgresql://***:***@localhost:5432/mastra_db"
                                disabled
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>PgVector Schema</FormLabel>
                            <Input
                                value="public"
                                disabled
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
