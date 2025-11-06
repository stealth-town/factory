import { useEffect, useState } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { supabase } from '@/lib/supabase'

/**
 * Hook to check if user is authenticated
 * Returns true only if:
 * 1. Wallet is connected
 * 2. Supabase session exists and is valid
 */
export function useAuthStatus() {
  const { connected, account } = useWalletUi()
  const [hasSession, setHasSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setHasSession(!!session)
      setIsLoading(false)
    }

    checkSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const hasWallet = connected && !!account
  const isAuthenticated = hasWallet && hasSession && !isLoading

  return {
    isAuthenticated,
    isLoading,
    hasWallet,
    hasSession,
  }
}

