"use client"

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleLogin } from './google-login'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm p-8 retro-card bg-surface">
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-white">Welcome Back</h1>
        <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="email@example.com" required className="bg-background border-gray-700 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="bg-background border-gray-700 text-white" />
        </div>
        
        {error && <p className="text-red-500 text-xs">{error}</p>}
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
          Login
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleLogin />
      
      <p className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <a href="/signup" className="text-primary hover:underline font-bold">Create Account</a>
      </p>
    </div>
  )
}
