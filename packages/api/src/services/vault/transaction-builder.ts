import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
} from '@solana/web3.js'
import {
	TOKEN_2022_PROGRAM_ID,
	getAssociatedTokenAddress,
	createTransferInstruction,
	getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'

/**
 * Transaction builder utility
 * Constructs unsigned Solana transactions for various game mechanics
 */
export class TransactionBuilder {
	constructor(
		private connection: Connection,
		private tokenMintAddress: PublicKey,
		private deadAddress: PublicKey
	) {}

	/**
	 * Build unsigned transaction for token burn (user → dead address)
	 * Used for gacha purchases
	 */
	async buildTokenBurnTransaction(
		userWallet: PublicKey,
		amount: bigint
	): Promise<{ transaction: Transaction; userTokenAccount: PublicKey; deadTokenAccount: PublicKey }> {
		// Get user's token account
		const userTokenAccount = await getAssociatedTokenAddress(
			this.tokenMintAddress,
			userWallet,
			false,
			TOKEN_2022_PROGRAM_ID
		)

		// Get dead address token account
		const deadTokenAccount = await getAssociatedTokenAddress(
			this.tokenMintAddress,
			this.deadAddress,
			false,
			TOKEN_2022_PROGRAM_ID
		)

		// Build transaction
		const transaction = new Transaction()

		// Add transfer instruction (burn by sending to dead address)
		transaction.add(
			createTransferInstruction(
				userTokenAccount,
				deadTokenAccount,
				userWallet,
				amount,
				[],
				TOKEN_2022_PROGRAM_ID
			)
		)

		// Get recent blockhash
		const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()
		transaction.recentBlockhash = blockhash
		transaction.lastValidBlockHeight = lastValidBlockHeight
		transaction.feePayer = userWallet

		return {
			transaction,
			userTokenAccount,
			deadTokenAccount,
		}
	}

	/**
	 * Build unsigned transaction for SOL transfer (user → vault)
	 * Used for shop purchases
	 */
	async buildSolTransferTransaction(
		fromWallet: PublicKey,
		toWallet: PublicKey,
		lamports: bigint
	): Promise<Transaction> {
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: fromWallet,
				toPubkey: toWallet,
				lamports,
			})
		)

		// Get recent blockhash
		const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()
		transaction.recentBlockhash = blockhash
		transaction.lastValidBlockHeight = lastValidBlockHeight
		transaction.feePayer = fromWallet

		return transaction
	}

	/**
	 * Build unsigned transaction for vault → user SOL transfer
	 * Backend pre-signs with vault authority
	 * Used for reward claims
	 */
	async buildVaultSolRewardTransaction(
		vaultKeypair: Keypair,
		recipientWallet: PublicKey,
		lamports: bigint
	): Promise<Transaction> {
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: vaultKeypair.publicKey,
				toPubkey: recipientWallet,
				lamports,
			})
		)

		// Get recent blockhash
		const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()
		transaction.recentBlockhash = blockhash
		transaction.lastValidBlockHeight = lastValidBlockHeight
		transaction.feePayer = recipientWallet // User pays for fees

		// Backend pre-signs with vault
		transaction.partialSign(vaultKeypair)

		return transaction
	}

	/**
	 * Build unsigned transaction for vault → user token transfer
	 * Backend pre-signs with vault authority
	 * Used for token rewards
	 */
	async buildVaultTokenRewardTransaction(
		vaultKeypair: Keypair,
		recipientWallet: PublicKey,
		amount: bigint
	): Promise<Transaction> {
		// Get vault's token account
		const vaultTokenAccount = await getAssociatedTokenAddress(
			this.tokenMintAddress,
			vaultKeypair.publicKey,
			false,
			TOKEN_2022_PROGRAM_ID
		)

		// Get recipient's token account
		const recipientTokenAccount = await getAssociatedTokenAddress(
			this.tokenMintAddress,
			recipientWallet,
			false,
			TOKEN_2022_PROGRAM_ID
		)

		const transaction = new Transaction()

		transaction.add(
			createTransferInstruction(
				vaultTokenAccount,
				recipientTokenAccount,
				vaultKeypair.publicKey,
				amount,
				[],
				TOKEN_2022_PROGRAM_ID
			)
		)

		// Get recent blockhash
		const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()
		transaction.recentBlockhash = blockhash
		transaction.lastValidBlockHeight = lastValidBlockHeight
		transaction.feePayer = recipientWallet // User pays for fees

		// Backend pre-signs with vault
		transaction.partialSign(vaultKeypair)

		return transaction
	}

	/**
	 * Serialize transaction to base64 string
	 */
	serializeTransaction(transaction: Transaction): string {
		return transaction.serialize({
			requireAllSignatures: false,
			verifySignatures: false,
		}).toString('base64')
	}
}
