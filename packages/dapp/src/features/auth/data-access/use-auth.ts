import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { signAuthMessage } from '../utils/sign-message'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  walletAddress: string
}

/**
 * Hook for wallet-based authentication using Supabase Web3 auth
 */
export function useAuth() {
  const { account, signMessage, connected } = useWalletUi()

  const login = useMutation({
    mutationFn: async (): Promise<AuthUser> => {
      if (!account || !signMessage || !connected) {
        throw new Error('Wallet not connected')
      }

      const walletAddress = account.address

      // Sign message with wallet
      const { signature, message } = await signAuthMessage(
        walletAddress,
        signMessage
      )

      // Call Supabase Web3 auth directly
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'solana',
        token: signature,
        nonce: message, // The message acts as nonce
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('No user data returned')
      }

      return {
        id: data.user.id,
        walletAddress: data.user.user_metadata?.wallet_address || walletAddress,
      }
    },
  })

  return {
    login,
    isAuthenticated: connected && !!account,
  }
}

