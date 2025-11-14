import dotenv from 'dotenv'
import path from 'path'

// Load .env file from package root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const config = {
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8899',
  tokenMintAddress: process.env.TOKEN_MINT_ADDRESS || '',
  mintAuthorityKeypairPath:
    process.env.MINT_AUTHORITY_KEYPAIR_PATH || './keypairs/mint-authority.json',
}

export default config
