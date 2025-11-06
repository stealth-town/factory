import bs58 from 'bs58'

/**
 * Sign authentication message for Solana Web3 auth
 */
export async function signAuthMessage(
  walletAddress: string,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
): Promise<{ signature: string; message: string }> {
  const timestamp = Date.now()
  const message = `I hereby authorize the use of my Solana wallet ${walletAddress} for authentication purposes.\nTimestamp: ${timestamp}`
  
  const encodedMessage = new TextEncoder().encode(message)
  const signatureBytes = await signMessage(encodedMessage)
  
  // Convert signature to base58 string
  const signature = bs58.encode(signatureBytes)
  
  return {
    signature,
    message,
  }
}

