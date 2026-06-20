"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid email or password' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid email or password' }
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=Check your email to confirm your account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  if (!email || typeof email !== 'string') {
    return { error: 'Email is required' }
  }

  const schema = z.string().email()
  const parsed = schema.safeParse(email)
  if (!parsed.success) {
    return { error: 'Invalid email address' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback?next=/update-password`,
  })

  if (error) return { error: error.message }

  return { success: true }
}
