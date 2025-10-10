'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Alert from '@mui/joy/Alert'
import Chip from '@mui/joy/Chip'
import { Info, Save } from '@mui/icons-material'

/**
 * Model Configuration Types
 */
interface ModelConfig {
    primaryModel: string
    fallbackModel: string
    temperature: number
    maxTokens: number
    topP: number
}

/**
 * ModelSelector Component
 *
 * AI model configuration interface with parameter controls.
 * Supports primary/fallback model selection and parameter tuning.
 */
export default function ModelSelector() {
    const [config, setConfig] = React.useState<ModelConfig>({
        primaryModel: 'gemini-2.0-flash-exp',
        fallbackModel: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9
    })
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState<{ type: 'success' | 'danger'; text: string } | null>(null)

    const handleSave = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/settings/models', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (!response.ok) {
                throw new Error('Failed to save model configuration')
            }

            setMessage({ type: 'success', text: 'Model configuration saved successfully' })
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error instanceof Error ? error.message : 'Failed to save configuration'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setConfig({
            primaryModel: 'gemini-2.0-flash-exp',
            fallbackModel: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 2048,
            topP: 0.9
        })
        setMessage(null)
    }

    return (
        <Stack spacing={3}>
            {/* Info Alert */}
            <Alert variant="soft" color="primary" startDecorator={<Info />}>
                Model selection affects all AI agents and workflows. Changes take effect immediately after saving.
            </Alert>

            {message !== null && (
                <Alert variant="soft" color={message.type}>
                    {message.text}
                </Alert>
            )}

            {/* Model Selection */}
            <Card>
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Model Selection
                    </Typography>

                    <Stack spacing={2}>
                        {/* Primary Model */}
                        <FormControl>
                            <FormLabel>Primary Model</FormLabel>
                            <Select
                                value={config.primaryModel}
                                onChange={(_event, value) => {
                                    if (value !== null) {
                                        setConfig((prev) => ({ ...prev, primaryModel: value }))
                                    }
                                }}
                            >
                                <Option value="gemini-2.0-flash-exp">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>Gemini 2.0 Flash</span>
                                        <Chip size="sm" variant="soft" color="primary">
                                            Recommended
                                        </Chip>
                                    </Stack>
                                </Option>
                                <Option value="gemini-1.5-pro">Gemini 1.5 Pro</Option>
                                <Option value="gemini-1.5-flash">Gemini 1.5 Flash</Option>
                                <Option value="gpt-4o">GPT-4o</Option>
                                <Option value="gpt-4o-mini">GPT-4o Mini</Option>
                                <Option value="gpt-4-turbo">GPT-4 Turbo</Option>
                                <Option value="claude-3-5-sonnet">Claude 3.5 Sonnet</Option>
                                <Option value="claude-3-opus">Claude 3 Opus</Option>
                            </Select>
                        </FormControl>

                        {/* Fallback Model */}
                        <FormControl>
                            <FormLabel>Fallback Model</FormLabel>
                            <Select
                                value={config.fallbackModel}
                                onChange={(_event, value) => {
                                    if (value !== null) {
                                        setConfig((prev) => ({ ...prev, fallbackModel: value }))
                                    }
                                }}
                            >
                                <Option value="gpt-4o-mini">GPT-4o Mini</Option>
                                <Option value="gemini-1.5-flash">Gemini 1.5 Flash</Option>
                                <Option value="gpt-4o">GPT-4o</Option>
                                <Option value="claude-3-5-sonnet">Claude 3.5 Sonnet</Option>
                            </Select>
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Used when primary model fails or is unavailable
                            </Typography>
                        </FormControl>
                    </Stack>
                </CardContent>
            </Card>

            {/* Model Parameters */}
            <Card>
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Model Parameters
                    </Typography>

                    <Stack spacing={3}>
                        {/* Temperature */}
                        <FormControl>
                            <FormLabel>
                                Temperature: {config.temperature}
                            </FormLabel>
                            <Slider
                                value={config.temperature}
                                onChange={(_event, value) => {
                                    if (typeof value === 'number') {
                                        setConfig((prev) => ({ ...prev, temperature: value }))
                                    }
                                }}
                                min={0}
                                max={2}
                                step={0.1}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 0, label: 'Focused' },
                                    { value: 1, label: 'Balanced' },
                                    { value: 2, label: 'Creative' }
                                ]}
                            />
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Controls randomness. Lower values = more focused, higher = more creative
                            </Typography>
                        </FormControl>

                        {/* Max Tokens */}
                        <FormControl>
                            <FormLabel>
                                Max Tokens: {config.maxTokens}
                            </FormLabel>
                            <Slider
                                value={config.maxTokens}
                                onChange={(_event, value) => {
                                    if (typeof value === 'number') {
                                        setConfig((prev) => ({ ...prev, maxTokens: value }))
                                    }
                                }}
                                min={512}
                                max={8192}
                                step={256}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 512, label: '512' },
                                    { value: 2048, label: '2K' },
                                    { value: 4096, label: '4K' },
                                    { value: 8192, label: '8K' }
                                ]}
                            />
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Maximum length of generated responses
                            </Typography>
                        </FormControl>

                        {/* Top P */}
                        <FormControl>
                            <FormLabel>
                                Top P (Nucleus Sampling): {config.topP}
                            </FormLabel>
                            <Slider
                                value={config.topP}
                                onChange={(_event, value) => {
                                    if (typeof value === 'number') {
                                        setConfig((prev) => ({ ...prev, topP: value }))
                                    }
                                }}
                                min={0}
                                max={1}
                                step={0.05}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 0.5, label: '0.5' },
                                    { value: 1, label: '1' }
                                ]}
                            />
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Controls diversity via nucleus sampling. Lower = more focused, higher = more diverse
                            </Typography>
                        </FormControl>
                    </Stack>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" color="neutral" onClick={handleReset} disabled={loading}>
                    Reset to Defaults
                </Button>
                <Button startDecorator={<Save />} loading={loading} onClick={handleSave}>
                    Save Configuration
                </Button>
            </Stack>
        </Stack>
    )
}
