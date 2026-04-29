'use client'
import { supabase } from '@/lib/supabaseClient'

export default function LoginButton() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  return (
    <button onClick={login} className="btn">
      Sign in with Google
    </button>
  )
}
