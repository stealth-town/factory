#!/usr/bin/env node

import {
  getMint,
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  createInitializeTransferFeeConfigInstruction,
  createInitializeMintInstruction,
  getMintLen,
} from '@solana/spl-token'
import {
  LAMPORTS_PER_SOL,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { createConnection, requestAirdrop } from '../utils/connection.js'
import { loadOrGenerateKeypair } from '../utils/keypair.js'
import config from '../utils/config.js'

/**
 * Create a new Token2022 token with transfer tax for local development
 */
async function main() {
  console.log('Creating Token2022 with Transfer Tax...\n')

  // Create connection
  const connection = createConnection(config.rpcUrl)

  // Load or generate mint authority keypair
  const mintAuthority = loadOrGenerateKeypair(config.mintAuthorityKeypairPath)

  // Check balance and airdrop if needed
  const balance = await connection.getBalance(mintAuthority.publicKey)
  console.log(`Mint authority balance: ${balance / LAMPORTS_PER_SOL} SOL`)

  if (balance < LAMPORTS_PER_SOL * 0.1) {
    console.log('Low balance, requesting airdrop...')
    await requestAirdrop(connection, mintAuthority.publicKey, 2)
  }

  // Generate mint keypair
  const mintKeypair = Keypair.generate()
  const mint = mintKeypair.publicKey

  // Token configuration
  const decimals = 9
  const transferFeeBasisPoints = 100 // 1% transfer fee (100 basis points)
  const maxFee = BigInt(1_000_000_000) // Maximum fee of 1 token (with decimals)

  console.log('\nToken Configuration:')
  console.log(`  Decimals: ${decimals}`)
  console.log(`  Transfer Fee: ${transferFeeBasisPoints / 100}%`)
  console.log(`  Max Fee per Transfer: ${Number(maxFee) / Math.pow(10, decimals)} tokens`)

  // Calculate space required for mint with transfer fee extension
  const extensions = [ExtensionType.TransferFeeConfig]
  const mintLen = getMintLen(extensions)

  // Calculate minimum balance for rent exemption
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen)

  console.log('\nCreating token mint with transfer tax extension...')

  // Build transaction
  const transaction = new Transaction().add(
    // Create account for mint
    SystemProgram.createAccount({
      fromPubkey: mintAuthority.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    // Initialize transfer fee extension
    createInitializeTransferFeeConfigInstruction(
      mint,
      mintAuthority.publicKey, // Transfer fee config authority
      mintAuthority.publicKey, // Withdraw withheld authority
      transferFeeBasisPoints,
      maxFee,
      TOKEN_2022_PROGRAM_ID
    ),
    // Initialize mint
    createInitializeMintInstruction(
      mint,
      decimals,
      mintAuthority.publicKey, // Mint authority
      mintAuthority.publicKey, // Freeze authority
      TOKEN_2022_PROGRAM_ID
    )
  )

  // Send transaction
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [mintAuthority, mintKeypair],
    { commitment: 'confirmed' }
  )

  console.log(`\n✅ Token created successfully!`)
  console.log(`\n📋 Token Details:`)
  console.log(`   Mint Address: ${mint.toBase58()}`)
  console.log(`   Mint Authority: ${mintAuthority.publicKey.toBase58()}`)
  console.log(`   Program: Token-2022 (Token Extensions)`)
  console.log(`   Decimals: ${decimals}`)
  console.log(`   Transfer Tax: ${transferFeeBasisPoints / 100}%`)
  console.log(`   Transaction: ${signature}`)

  // Verify the mint
  const mintInfo = await getMint(connection, mint, 'confirmed', TOKEN_2022_PROGRAM_ID)
  console.log(`\n✅ Token verified on-chain`)
  console.log(`   Supply: ${mintInfo.supply.toString()}`)
  console.log(`   Is Initialized: ${mintInfo.isInitialized}`)

  console.log(`\n📝 Next steps:`)
  console.log(`   1. Add this to your .env file:`)
  console.log(`      TOKEN_MINT_ADDRESS=${mint.toBase58()}`)
  console.log(`\n   2. Mint tokens to an address:`)
  console.log(`      yarn mint-tokens <recipient-address> <amount>`)
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
