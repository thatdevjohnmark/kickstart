import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-pixel">
            KICKSTART
          </h1>
          <p className="text-muted-foreground">
            Start tracking your applications today.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
