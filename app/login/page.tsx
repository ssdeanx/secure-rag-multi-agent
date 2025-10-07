import { AuthForm } from '@/components/login/AuthForm'

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background flex items-center py-16">
            <div className="w-full px-4">
                <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto shadow-sm">
                    <h1 className="text-2xl font-bold mb-4 tracking-tight">
                        Sign in
                    </h1>
                    <AuthForm />
                </div>
            </div>
        </main>
    )
}
