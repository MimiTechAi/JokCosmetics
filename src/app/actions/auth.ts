'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getSession() {
  const cookieStore = cookies()
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error.message)
    return null
  }
  
  return session
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
  
  return { success: true }
}
