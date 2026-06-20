"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function GoogleLogin() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Google login error:", error.message)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center gap-2" 
      onClick={handleGoogleLogin}
    >
      <Globe className="h-4 w-4" />
      Continue with Google
    </Button>
  )
}
