import { Box, Typography } from '@/components/ui/joy'
import { AuthForm } from '@/components/login/AuthForm.joy'

export default function LoginPage() {
    return (
        <Box
            component="main"
            sx={{ minHeight: '100vh', backgroundColor: 'background.body', py: 8 }}
        >
            <Box sx={{ maxWidth: 480, mx: 'auto', px: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography level="h2" sx={{ fontWeight: 800 }}>
                        Sign in
                    </Typography>
                    <Typography
                        level="body-sm"
                        sx={{ color: 'text.secondary' }}
                    >
                        Sign in to your account
                    </Typography>
                </Box>
                <AuthForm mode="login" />
            </Box>
        </Box>
    )
}
