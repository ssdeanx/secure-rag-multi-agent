'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Textarea from '@mui/joy/Textarea'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import IconButton from '@mui/joy/IconButton'
import Divider from '@mui/joy/Divider'
import { Save, PhotoCamera, AccountCircle } from '@mui/icons-material'
import { useSession } from '@/hooks/use-session'

interface ProfileFormData {
    displayName: string
    email: string
    bio: string
    avatarUrl: string
}

/**
 * Profile Form Component
 *
 * Form for editing user profile information including display name,
 * email, bio, and avatar. Integrates with Supabase user management.
 */
export default function ProfileForm() {
    const { session, loading } = useSession()
    const [formData, setFormData] = React.useState<ProfileFormData>({
        displayName: '',
        email: '',
        bio: '',
        avatarUrl: '',
    })
    const [saving, setSaving] = React.useState(false)
    const [successMessage, setSuccessMessage] = React.useState<string>('')

    // Load user data from session
    React.useEffect(() => {
        if (session?.user) {
            setFormData({
                displayName: session.user.user_metadata?.display_name ?? '',
                email: session.user.email ?? '',
                bio: session.user.user_metadata?.bio ?? '',
                avatarUrl: session.user.user_metadata?.avatar_url ?? '',
            })
        }
    }, [session])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setSuccessMessage('')

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    display_name: formData.displayName,
                    bio: formData.bio,
                    avatar_url: formData.avatarUrl,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            setSuccessMessage('Profile updated successfully')
        } catch (error) {
            // TODO: Add proper error handling with toast/snackbar
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            setSuccessMessage(`Error: ${errorMessage}`)
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (
        field: keyof ProfileFormData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Loading profile...</Typography>
            </Box>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card variant="outlined">
                <CardContent>
                    {/* Avatar Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography level="title-md" sx={{ mb: 2 }}>
                            Profile Picture
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={formData.avatarUrl || undefined}
                                alt={formData.displayName}
                                sx={{ width: 80, height: 80 }}
                            >
                                {!formData.avatarUrl && <AccountCircle sx={{ fontSize: 40 }} />}
                            </Avatar>
                            <Box>
                                <IconButton
                                    variant="outlined"
                                    color="neutral"
                                    component="label"
                                >
                                    <PhotoCamera />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            // TODO: Implement avatar upload
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                // For now, create object URL for preview
                                                const url = URL.createObjectURL(file)
                                                handleInputChange('avatarUrl', url)
                                            }
                                        }}
                                    />
                                </IconButton>
                                <Typography level="body-xs" sx={{ mt: 1, color: 'text.tertiary' }}>
                                    JPG, GIF or PNG. Max size of 2MB
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Basic Information */}
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Basic Information
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl required>
                            <FormLabel>Display Name</FormLabel>
                            <Input
                                value={formData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                placeholder="Enter your display name"
                            />
                        </FormControl>

                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={formData.email}
                                disabled
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                            />
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.tertiary' }}>
                                Email cannot be changed here. Contact support if you need to update your email.
                            </Typography>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                minRows={4}
                                maxRows={8}
                            />
                            <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.tertiary' }}>
                                Brief description for your profile. Maximum 500 characters.
                            </Typography>
                        </FormControl>
                    </Box>

                    {/* Success Message */}
                    {successMessage && (
                        <Typography
                            level="body-sm"
                            sx={{
                                mt: 2,
                                p: 1,
                                borderRadius: 'sm',
                                bgcolor: successMessage.startsWith('Error')
                                    ? 'danger.softBg'
                                    : 'success.softBg',
                                color: successMessage.startsWith('Error')
                                    ? 'danger.softColor'
                                    : 'success.softColor',
                            }}
                        >
                            {successMessage}
                        </Typography>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                        <Button
                            type="button"
                            variant="outlined"
                            color="neutral"
                            onClick={() => {
                                // Reset form to original values
                                if (session?.user) {
                                    setFormData({
                                        displayName: session.user.user_metadata?.display_name ?? '',
                                        email: session.user.email ?? '',
                                        bio: session.user.user_metadata?.bio ?? '',
                                        avatarUrl: session.user.user_metadata?.avatar_url ?? '',
                                    })
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            loading={saving}
                            startDecorator={<Save />}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Password Section */}
            <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                        Password
                    </Typography>
                    <Typography level="body-sm" sx={{ mb: 2, color: 'text.tertiary' }}>
                        Change your password to keep your account secure
                    </Typography>
                    <Button variant="outlined" color="neutral">
                        Change Password
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
