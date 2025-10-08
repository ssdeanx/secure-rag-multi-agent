'use client'
import React, { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Input } from '@/components/ui/shadnui/input'
import { Textarea } from '@/components/ui/shadnui/textarea'
import { Button } from '@/components/ui/shadnui/button'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/shadnui/select'

interface ContactPayload {
    name: string
    email: string
    category: string
    message: string
}

export function ContactForm() {
    const [form, setForm] = useState<ContactPayload>({
        name: '',
        email: '',
        category: 'general',
        message: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    useReducedMotion() // Reserved for future subtle motion adjustments respecting user preference.

    function update<K extends keyof ContactPayload>(
        key: K,
        value: ContactPayload[K]
    ) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('All required fields must be filled.')
            return
        }
        if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(form.email)) {
            setError('Please provide a valid email address.')
            return
        }

        try {
            setLoading(true)
            // Placeholder: in production post to /api/contact
            await new Promise((r) => setTimeout(r, 600))
            setSuccess(true)
            setForm({ name: '', email: '', category: 'general', message: '' })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 max-w-2xl mx-auto"
            aria-describedby={
                error !== null && error.length > 0 ? 'contact-error' : undefined
            }
        >
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="contact-name"
                        className="text-sm font-semibold text-foreground"
                    >
                        Name *
                    </label>
                    <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        required
                        aria-required="true"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="contact-email"
                        className="text-sm font-semibold text-foreground"
                    >
                        Email *
                    </label>
                    <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={(() => {
                            if (error === null || error.length === 0) {
                                return 'false'
                            }
                            return error.includes('email') ? 'true' : 'false'
                        })()}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                    Category
                </label>
                <Select
                    value={form.category}
                    onValueChange={(v) => update('category', v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="contact-message"
                    className="text-sm font-semibold text-foreground"
                >
                    Message *
                </label>
                <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    rows={6}
                    required
                    aria-required="true"
                />
            </div>
            <div
                aria-live="polite"
                aria-atomic="true"
                className="min-h-[1.5rem]"
            >
                {error !== null && error.length > 0 ? (
                    <p
                        id="contact-error"
                        role="alert"
                        className="text-sm text-destructive"
                    >
                        {error}
                    </p>
                ) : success ? (
                    <p className="text-sm text-green-600">
                        Message sent successfully. We'll respond soon.
                    </p>
                ) : null}
            </div>
            <div className="flex items-center gap-4 pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold"
                >
                    {loading ? 'Sending…' : 'Send Message'}
                </Button>
                <Button
                    type="reset"
                    variant="outline"
                    className="border-2 transition-all duration-200 hover:bg-primary/5"
                    onClick={() => {
                        setForm({
                            name: '',
                            email: '',
                            category: 'general',
                            message: '',
                        })
                        setError(null)
                        setSuccess(false)
                    }}
                    disabled={loading}
                >
                    Reset
                </Button>
            </div>
        </form>
    )
}
