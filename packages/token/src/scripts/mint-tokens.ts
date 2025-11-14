#!/usr/bin/env node

import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createConnection, requestAirdrop } from '../utils/connection.js'
import { loadKeypairFromFile } from '../utils/keypair.js'
import config from '../utils/config.js'

/**
 * Mint Token2022 tokens to a specified address
 *
 * Usage: yarn mint-tokens <recipient-address> <amount>
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Usage: yarn mint-tokens <recipient-address> <amount>')
    console.error('\nExample: yarn mint-tokens 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 1000')
    process.exit(1)
  }

  const recipientAddress = args[0]
  const amount = parseFloat(args[1])

  if (isNaN(amount) || amount <= 0) {
    console.error('Invalid amount. Must be a positive number.')
    process.exit(1)
  }

  console.log('Minting Token2022 tokens...\n')

  // Validate token mint address
  if (!config.tokenMintAddress) {
    console.error('TOKEN_MINT_ADDRESS not set in .env file')
    console.error('Run "yarn create-token" first to create a token')
    process.exit(1)
  }

  // Create connection
  const connection = createConnection(config.rpcUrl)

  // Load mint authority keypair
  let mintAuthority
  try {
    mintAuthority = loadKeypairFromFile(config.mintAuthorityKeypairPath)
  } catch (error) {
    console.error('Failed to load mint authority keypair')
    console.error('Run "yarn create-token" first to create a token')
    process.exit(1)
  }

  // Check balance and airdrop if needed
  const balance = await connection.getBalance(mintAuthority.publicKey)
  console.log(`Mint authority balance: ${balance / LAMPORTS_PER_SOL} SOL`)

  if (balance < LAMPORTS_PER_SOL * 0.05) {
    console.log('Low balance, requesting airdrop...')
    await requestAirdrop(connection, mintAuthority.publicKey, 1)
  }

  // Parse addresses
  const mintPublicKey = new PublicKey(config.tokenMintAddress)
  const recipientPublicKey = new PublicKey(recipientAddress)

  console.log(`\n📋 Mint Details:`)
  console.log(`   Token Mint: ${mintPublicKey.toBase58()}`)
  console.log(`   Recipient: ${recipientPublicKey.toBase58()}`)
  console.log(`   Amount: ${amount}`)

  // Get mint info (Token2022)
  const mintInfo = await getMint(
    connection,
    mintPublicKey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  )
  console.log(`   Decimals: ${mintInfo.decimals}`)
  console.log(`   Program: Token-2022`)

  // Get or create associated token account for recipient (Token2022)
  console.log(`\n⚙️  Getting or creating Token2022 account for recipient...`)

  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority, // Payer
    mintPublicKey, // Mint
    recipientPublicKey, // Owner
    false, // allowOwnerOffCurve
    'confirmed', // Commitment
    undefined, // confirmOptions
    TOKEN_2022_PROGRAM_ID // Program ID
  )

  console.log(`   Token account: ${recipientTokenAccount.address.toBase58()}`)

  // Calculate amount with decimals
  const amountWithDecimals = BigInt(amount * Math.pow(10, mintInfo.decimals))

  // Mint tokens (Token2022)
  console.log(`\n💰 Minting ${amount} tokens...`)

  const signature = await mintTo(
    connection,
    mintAuthority, // Payer
    mintPublicKey, // Mint
    recipientTokenAccount.address, // Destination
    mintAuthority, // Mint authority
    amountWithDecimals, // Amount (with decimals)
    [], // MultiSigners
    { commitment: 'confirmed' }, // Confirm options
    TOKEN_2022_PROGRAM_ID // Program ID
  )

  console.log(`\n✅ Tokens minted successfully!`)
  console.log(`   Transaction: ${signature}`)
  console.log(`   Recipient Token Account: ${recipientTokenAccount.address.toBase58()}`)
  console.log(`   Amount: ${amount} tokens`)

  // Get updated supply
  const updatedMintInfo = await getMint(
    connection,
    mintPublicKey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  )
  const totalSupply = Number(updatedMintInfo.supply) / Math.pow(10, mintInfo.decimals)

  console.log(`\n📊 Token Stats:`)
  console.log(`   Total Supply: ${totalSupply}`)
  console.log(`   ⚠️  Note: Transfers will incur transfer tax based on token config`)
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
