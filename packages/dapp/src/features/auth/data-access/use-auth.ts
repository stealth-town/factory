import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { PublicKey } from '@solana/web3.js'
import { signAuthMessage } from '../utils/sign-message'
import { supabase } from '@/lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface AuthUser {
  id: string
  walletAddress: string
  nickname: string | null
  balance: number
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

/**
 * Hook for wallet-based authentication
 */
export function useAuth() {
  const { publicKey, signMessage, connected } = useWalletUi()

  const login = useMutation({
    mutationFn: async (): Promise<AuthUser> => {
      if (!publicKey || !signMessage || !connected) {
        throw new Error('Wallet not connected')
      }

      // Sign authentication message
      const { signature, message } = await signAuthMessage(
        new PublicKey(publicKey),
        signMessage
      )

      // Send to backend for verification and session creation
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey,
          signature,
          message,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Login failed' }))
        throw new Error(error.error || `Login failed: ${response.statusText}`)
      }

      const data: LoginResponse = await response.json()

      // Set session in Supabase client for RLS
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      })

      if (sessionError) {
        throw new Error(`Failed to set session: ${sessionError.message}`)
      }

      return data.user
    },
  })

  return {
    login,
    isAuthenticated: connected && !!publicKey,
  }
}

