import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { UserRepository } from '@launch-solana/shared'
import { supabaseAdmin } from '../lib/supabase'

export interface ILoginResult {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        walletAddress: string
        nickname: string | null
        balance: number
    }
}

/**
 * Verify Solana signature and authenticate/register user
 */
export async function loginWithWallet(
    walletAddress: string,
    signature: string,
    message: string
): Promise<ILoginResult> {
    
    // Verify signature
    const publicKey = new PublicKey(walletAddress)
    const messageBytes = new TextEncoder().encode(message)

    // Decode signature from base58 (Solana wallets typically return base58-encoded signatures)
    let signatureBytes: Uint8Array
    try {
        signatureBytes = bs58.decode(signature)
    } catch (error) {
        // If base58 decode fails, try base64 (some wallets might use base64)
        try {
            signatureBytes = Uint8Array.from(Buffer.from(signature, 'base64'))
        } catch {
            throw new Error('Invalid signature format')
        }
    }

    // Verify Ed25519 signature using nacl
    const publicKeyBytes = publicKey.toBytes()
    const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
    )

    if (!isValid) {
        throw new Error('Invalid signature')
    }

    // Check if user exists
    const userRepo = new UserRepository(supabaseAdmin)
    let user = await userRepo.getByWallet(walletAddress)

    if (!user) {
        // Create new Supabase auth user
        // The trigger will automatically create the users table entry, factory, and generator
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: `${walletAddress}@wallet.local`,
            email_confirm: true,
            user_metadata: {
                wallet_address: walletAddress,
            },
        })

        if (authError) {
            throw new Error(`Failed to create user: ${authError.message}`)
        }

        if (!authData.user) {
            throw new Error('Failed to create user: No user data returned')
        }

        // Wait a moment for the trigger to execute, then fetch the user
        // The trigger creates the users table entry automatically
        await new Promise((resolve) => setTimeout(resolve, 100))
        user = await userRepo.getById(authData.user.id)

        if (!user) {
            throw new Error('User created but not found in database')
        }
    }

    // Generate session tokens
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createUserSession({
        userId: user.id,
    })

    if (sessionError || !sessionData.session) {
        throw new Error(`Failed to create session: ${sessionError?.message || 'Unknown error'}`)
    }

    return {
        accessToken: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
        user: {
            id: user.id,
            walletAddress: user.wallet_address,
            nickname: user.nickname,
            balance: user.balance,
        },
    }
}

