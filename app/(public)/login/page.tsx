import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-pixel">
            KICKSTART
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
