#!/usr/bin/env node

import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { createConnection } from '../utils/connection.js'
import config from '../utils/config.js'

/**
 * Get Token2022 token balance for an address
 *
 * Usage: yarn get-balance <wallet-address>
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error('Usage: yarn get-balance <wallet-address>')
    console.error('\nExample: yarn get-balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')
    process.exit(1)
  }

  const walletAddress = args[0]

  console.log('Checking Token2022 Balance...\n')

  // Validate token mint address
  if (!config.tokenMintAddress) {
    console.error('TOKEN_MINT_ADDRESS not set in .env file')
    console.error('Run "yarn create-token" first to create a token')
    process.exit(1)
  }

  // Create connection
  const connection = createConnection(config.rpcUrl)

  // Parse addresses
  const mintPublicKey = new PublicKey(config.tokenMintAddress)
  const walletPublicKey = new PublicKey(walletAddress)

  console.log(`📋 Details:`)
  console.log(`   Token Mint: ${mintPublicKey.toBase58()}`)
  console.log(`   Wallet: ${walletPublicKey.toBase58()}`)

  // Get mint info (Token2022)
  const mintInfo = await getMint(
    connection,
    mintPublicKey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  )
  console.log(`   Decimals: ${mintInfo.decimals}`)
  console.log(`   Program: Token-2022`)

  // Get associated token account address (Token2022)
  const tokenAccountAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    walletPublicKey,
    false, // allowOwnerOffCurve
    TOKEN_2022_PROGRAM_ID
  )

  console.log(`\n💼 Token Account: ${tokenAccountAddress.toBase58()}`)

  try {
    // Get token account (Token2022)
    const tokenAccount = await getAccount(
      connection,
      tokenAccountAddress,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    // Calculate balance with decimals
    const balance = Number(tokenAccount.amount) / Math.pow(10, mintInfo.decimals)

    console.log(`\n✅ Balance: ${balance} tokens`)
    console.log(`   Raw Amount: ${tokenAccount.amount.toString()}`)
  } catch (error) {
    console.log(`\n⚠️  Token account does not exist (balance: 0)`)
    console.log(`   This address has not received any tokens yet`)
  }

  // Show total supply
  const totalSupply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals)
  console.log(`\n📊 Total Supply: ${totalSupply} tokens`)
}

main()
  .then(() => {
    console.log('\n  Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n  Error:', error)
    process.exit(1)
  })
