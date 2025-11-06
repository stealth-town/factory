import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'

/**
 * Sign an authentication message with the wallet
 * Returns the signature in base58 format and the original message
 */
export async function signAuthMessage(
  publicKey: PublicKey,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
): Promise<{ signature: string; message: string }> {
  const timestamp = Date.now()
  const message = `Sign in to Launch Solana\nWallet: ${publicKey.toBase58()}\nTimestamp: ${timestamp}`
  
  const encodedMessage = new TextEncoder().encode(message)
  const signatureBytes = await signMessage(encodedMessage)
  
  // Convert signature to base58 string
  const signature = bs58.encode(signatureBytes)
  
  return {
    signature,
    message,
  }
}

