import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  walletAddress: string
}


// #region - New implementation
export function useAuth() {
  const { account, connected } = useWalletUi()

  const login = useMutation({
    mutationFn: async (): Promise<AuthUser> => {
      if (!connected || !account) {
        throw new Error('Wallet not connected')
      }

      const walletAddress = account.address

      // Step 1: Authenticate with Supabase Web3
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service at https://example.com/tos',
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('No user data returned')
      }

      const userId = data.user.id

      // Step 2: Check if user exists in public.users
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, wallet_address')
        .eq('id', userId)
        .single()

      // Step 3: If user doesn't exist, create all related records
      if (!existingUser && fetchError?.code === 'PGRST116') {
        // User doesn't exist, create them
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            wallet_address: walletAddress,
            wallet_chain: 'solana',
          })

        if (insertError) {
          throw new Error(`Failed to create user: ${insertError.message}`)
        }

        // Create generator
        const { error: generatorError } = await supabase
          .from('generator')
          .insert({ user_id: userId })

        if (generatorError) {
          throw new Error(`Failed to create generator: ${generatorError.message}`)
        }

        // Create factory
        const { error: factoryError } = await supabase
          .from('factory')
          .insert({ user_id: userId })

        if (factoryError) {
          throw new Error(`Failed to create factory: ${factoryError.message}`)
        }
      } else if (fetchError) {
        // Some other error occurred
        throw new Error(`Failed to fetch user: ${fetchError.message}`)
      }

      return {
        id: userId,
        walletAddress: existingUser?.wallet_address || walletAddress,
      }
    },
  })

  return {
    login,
  }
}
// #endregion



// #region - Old implementation
// export function useAuth() {
//   const { 
//     account,
//     connected,
//     // wallet // - for now until i figure out how to use it lmao
//   } = useWalletUi()

//   const login = useMutation({
//     mutationFn: async (): Promise<AuthUser> => {
//       if (!connected || !account) {
//         throw new Error('Wallet not connected')
//       }

//       // const walletAdapter = wallet?.adapter || window.solana as any

//       // Use Supabase's built-in Web3 auth
//       const { data, error } = await supabase.auth.signInWithWeb3({
//         chain: 'solana',
//         statement: 'I accept the Terms of Service at https://example.com/tos',
//         // Pass wallet if available, otherwise Supabase will use window.solana
//         // ...(wallet?.adapter && { wallet: wallet.adapter }),
//       })

//       if (error) {
//         throw new Error(error.message)
//       }

//       if (!data.user) {
//         throw new Error('No user data returned')
//       }

//       return {
//         id: data.user.id,
//         walletAddress: data.user.user_metadata?.wallet_address || account.address,
//       }
//     },
//   })

//   return {
//     login,
//   }
// }
// #endregion
