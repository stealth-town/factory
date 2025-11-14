import { Connection, clusterApiUrl } from '@solana/web3.js'

/**
 * Create a connection to Solana
 */
export function createConnection(rpcUrl?: string): Connection {
  const url = rpcUrl || process.env.RPC_URL || 'http://127.0.0.1:8899'

  console.log(`🌐 Connecting to: ${url}`)

  return new Connection(url, 'confirmed')
}

/**
 * Request airdrop (only works on devnet/testnet/localnet)
 */
export async function requestAirdrop(
  connection: Connection,
  publicKey: import('@solana/web3.js').PublicKey,
  amount: number = 1
): Promise<string> {
  console.log(`💰 Requesting ${amount} SOL airdrop...`)

  const signature = await connection.requestAirdrop(
    publicKey,
    amount * 1_000_000_000 // Convert SOL to lamports
  )

  await connection.confirmTransaction(signature, 'confirmed')

  console.log(`✅ Airdrop confirmed: ${signature}`)

  return signature
}
