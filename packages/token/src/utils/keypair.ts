import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import path from 'path'

/**
 * Load a keypair from a JSON file
 */
export function loadKeypairFromFile(filepath: string): Keypair {
  const absolutePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(process.cwd(), filepath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Keypair file not found: ${absolutePath}`)
  }

  const secretKeyString = fs.readFileSync(absolutePath, 'utf-8')
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString))

  return Keypair.fromSecretKey(secretKey)
}

/**
 * Save a keypair to a JSON file
 */
export function saveKeypairToFile(keypair: Keypair, filepath: string): void {
  const absolutePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(process.cwd(), filepath)

  // Ensure directory exists
  const directory = path.dirname(absolutePath)
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }

  const secretKey = Array.from(keypair.secretKey)
  fs.writeFileSync(absolutePath, JSON.stringify(secretKey), 'utf-8')

  console.log(`✅ Keypair saved to: ${absolutePath}`)
  console.log(`📍 Public key: ${keypair.publicKey.toBase58()}`)
}

/**
 * Generate a new keypair
 */
export function generateKeypair(): Keypair {
  return Keypair.generate()
}

/**
 * Load or generate a keypair
 * If the file exists, load it. Otherwise, generate a new one and save it.
 */
export function loadOrGenerateKeypair(filepath: string): Keypair {
  const absolutePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(process.cwd(), filepath)

  if (fs.existsSync(absolutePath)) {
    console.log(`📂 Loading keypair from: ${absolutePath}`)
    return loadKeypairFromFile(absolutePath)
  }

  console.log(`🔑 Generating new keypair...`)
  const keypair = generateKeypair()
  saveKeypairToFile(keypair, absolutePath)

  return keypair
}
