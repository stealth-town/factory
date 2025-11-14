import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { readFileSync } from 'fs'
import { TransactionBuilder } from './transaction-builder'
import { TransactionVerifier } from './transaction-verifier'
import config from '../../config'

/**
 * Vault Service
 * Centralized service for all money-related operations
 * Handles SOL and $TOKEN transactions with verification
 */
export class VaultService {
	private connection: Connection
	private vaultKeypair: Keypair
	private tokenMintAddress: PublicKey
	private deadAddress: PublicKey
	private transactionBuilder: TransactionBuilder
	private transactionVerifier: TransactionVerifier

	constructor() {
		// Initialize Solana connection
		this.connection = new Connection(config.solana.rpcUrl, 'confirmed')

		// Load vault keypair from file
		const keypairData = readFileSync(config.solana.vaultKeypairPath, 'utf-8')
		const secretKey = Uint8Array.from(JSON.parse(keypairData))
		this.vaultKeypair = Keypair.fromSecretKey(secretKey)

		// Initialize addresses
		this.tokenMintAddress = new PublicKey(config.solana.tokenMintAddress)
		this.deadAddress = new PublicKey(config.solana.deadAddress)

		// Initialize utilities
		this.transactionBuilder = new TransactionBuilder(
			this.connection,
			this.tokenMintAddress,
			this.deadAddress
		)
		this.transactionVerifier = new TransactionVerifier(this.connection)
	}

	/**
	 * Get Solana connection
	 */
	getConnection(): Connection {
		return this.connection
	}

	/**
	 * Get vault public key
	 */
	getVaultPublicKey(): PublicKey {
		return this.vaultKeypair.publicKey
	}

	/**
	 * Get token mint address
	 */
	getTokenMintAddress(): PublicKey {
		return this.tokenMintAddress
	}

	/**
	 * Get dead address for burns
	 */
	getDeadAddress(): PublicKey {
		return this.deadAddress
	}

	/**
	 * Build unsigned transaction for token burn (gacha purchase)
	 * User → Dead Address
	 */
	async buildTokenBurnTransaction(userWallet: PublicKey, amount: bigint) {
		return this.transactionBuilder.buildTokenBurnTransaction(userWallet, amount)
	}

	/**
	 * Build unsigned transaction for SOL transfer (shop purchase)
	 * User → Vault
	 */
	async buildSolTransferToVault(userWallet: PublicKey, lamports: bigint) {
		return this.transactionBuilder.buildSolTransferTransaction(
			userWallet,
			this.vaultKeypair.publicKey,
			lamports
		)
	}

	/**
	 * Build pre-signed transaction for SOL rewards
	 * Vault → User (backend pre-signs)
	 */
	async buildSolRewardTransaction(recipientWallet: PublicKey, lamports: bigint) {
		return this.transactionBuilder.buildVaultSolRewardTransaction(
			this.vaultKeypair,
			recipientWallet,
			lamports
		)
	}

	/**
	 * Build pre-signed transaction for token rewards
	 * Vault → User (backend pre-signs)
	 */
	async buildTokenRewardTransaction(recipientWallet: PublicKey, amount: bigint) {
		return this.transactionBuilder.buildVaultTokenRewardTransaction(
			this.vaultKeypair,
			recipientWallet,
			amount
		)
	}

	/**
	 * Serialize transaction to base64
	 */
	serializeTransaction(transaction: any): string {
		return this.transactionBuilder.serializeTransaction(transaction)
	}

	/**
	 * Verify a token burn transaction on-chain
	 * Returns actual amount burned
	 */
	async verifyTokenBurn(
		signature: string,
		userTokenAccount: PublicKey,
		deadTokenAccount: PublicKey,
		userWallet: PublicKey,
		minAmount: bigint
	): Promise<bigint> {
		return this.transactionVerifier.verifyTokenBurn(
			signature,
			userTokenAccount,
			deadTokenAccount,
			userWallet,
			minAmount
		)
	}

	/**
	 * Verify a SOL transfer transaction on-chain
	 * Returns actual lamports transferred
	 */
	async verifySolTransfer(
		signature: string,
		fromWallet: PublicKey,
		toWallet: PublicKey,
		minLamports: bigint
	): Promise<bigint> {
		return this.transactionVerifier.verifySolTransfer(signature, fromWallet, toWallet, minLamports)
	}
}
