import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Box, Typography } from '@/components/ui/joy'
import { AuthForm } from '@/components/login/AuthForm.joy'
import { generateDemoJWT } from '@/lib/actions/auth'

interface AuthFormData { email: string; password: string; role?: string }

// Server action passed to the client AuthForm
async function handleAuth(data: AuthFormData) {
    'use server'
    // Map UI roles to demo templates available in generateDemoJWT
    const mapRole = (role?: string): 'finance' | 'engineering' | 'hr' | 'executive' => {
        switch (role) {
            case 'finance_admin':
            case 'finance_viewer':
                return 'finance'
            case 'hr_admin':
            case 'hr_viewer':
                return 'hr'
            case 'admin':
                return 'executive'
            case undefined:
                return 'engineering'
            case 'employee':
            case 'public':
            default:
                return 'engineering'
        }
    }

    const roleId = mapRole(data.role)
    const token = await generateDemoJWT(roleId)
    const jar = await cookies()
    jar.set('demo_jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 2, // 2h
    })
    redirect('/')
}

export default function LoginPage() {
    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.body', py: 8 }}>
            <Box sx={{ maxWidth: 480, mx: 'auto', px: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography level="h2" sx={{ fontWeight: 800 }}>Sign in</Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        Use demo credentials to generate a scoped token
                    </Typography>
                </Box>
                <AuthForm mode="login" onSubmit={handleAuth} />
            </Box>
        </Box>
    )
}
