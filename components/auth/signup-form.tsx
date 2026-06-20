"use client"

import { useState } from "react"
import { signup } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      variant="pixel" 
      className="w-full" 
      disabled={pending}
    >
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="email@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 border-2 border-red-500 rounded-md">
            {error}
          </div>
        )}

        <SubmitButton />
      </form>
      
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-primary">
          Login here
        </Link>
      </div>
    </div>
  )
}
