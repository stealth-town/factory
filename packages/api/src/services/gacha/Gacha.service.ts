import { PublicKey } from '@solana/web3.js'
import { VaultService } from '../vault/Vault.service'
import {
	createSupabaseAdminClient,
	TransactionRepository,
	TransactionType,
	TransactionStatus,
} from '@launch-solana/shared'
import config from '../../config'
import { BadRequestError, NotFoundError } from '../../errors/AppError'

/**
 * Gacha purchase response
 */
export interface GachaPurchaseResponse {
	transactionId: string
	unsignedTransaction: string
	tokenAmount: string
	expiresAt: string
}

/**
 * Gacha verify response
 */
export interface GachaVerifyResponse {
	success: boolean
	item?: {
		itemId: number
		rarity: string
	}
}

/**
 * Gacha Service
 * Handles gacha roll purchases (token burn � random item)
 */
export class GachaService {
	private vault: VaultService
	private transactionRepo: TransactionRepository

	constructor() {
		this.vault = new VaultService()

		// Initialize Supabase admin client and repository
		const supabase = createSupabaseAdminClient(
			config.supabase.url,
			config.supabase.serviceKey
		)
		this.transactionRepo = new TransactionRepository(supabase)
	}

	/**
	 * Initiate gacha purchase
	 * Pre-rolls item, constructs burn transaction, stores pending record
	 */
	async purchaseGacha(userId: string, userWalletAddress: string): Promise<GachaPurchaseResponse> {
		// Fixed cost for gacha roll (1000 tokens with 9 decimals)
		const GACHA_COST = BigInt(1000 * Math.pow(10, 9))

		// Pre-roll random item (cryptographically secure)
		const rolledItem = this.preRollItem()

		// Parse user wallet address
		const userWallet = new PublicKey(userWalletAddress)

		// Build unsigned burn transaction
		const { transaction, userTokenAccount, deadTokenAccount } =
			await this.vault.buildTokenBurnTransaction(userWallet, GACHA_COST)

		// Serialize transaction
		const unsignedTransaction = this.vault.serializeTransaction(transaction)

		// Calculate expiration (5 minutes from now)
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

		// Store pending transaction with pre-rolled item
		const pendingTx = await this.transactionRepo.create({
			user_id: userId,
			transaction_type: TransactionType.GACHA_ROLL,
			status: TransactionStatus.PENDING,
			unsigned_transaction: unsignedTransaction,
			transaction_data: {
				item_id: rolledItem.itemId,
				item_rarity: rolledItem.rarity,
				cost_amount: GACHA_COST.toString(),
				user_token_account: userTokenAccount.toBase58(),
				dead_token_account: deadTokenAccount.toBase58(),
			},
			token_amount: Number(GACHA_COST),
			expires_at: expiresAt.toISOString(),
		})

		return {
			transactionId: pendingTx.id,
			unsignedTransaction,
			tokenAmount: GACHA_COST.toString(),
			expiresAt: expiresAt.toISOString(),
		}
	}

	/**
	 * Verify gacha purchase transaction
	 * Verifies burn on-chain, marks transaction confirmed
	 * (Item addition to inventory happens separately - not in this phase)
	 */
	async verifyGachaPurchase(
		transactionId: string,
		signature: string,
		userId: string
	): Promise<GachaVerifyResponse> {
		// Check for idempotency - if signature already used, return cached result
		const existingTx = await this.transactionRepo.getBySignature(signature)
		if (existingTx && existingTx.status === TransactionStatus.CONFIRMED) {
			const itemData = existingTx.transaction_data as any
			return {
				success: true,
				item: {
					itemId: itemData.item_id,
					rarity: itemData.item_rarity,
				},
			}
		}

		// Get pending transaction
		const pendingTx = await this.transactionRepo.getById(transactionId)

		if (!pendingTx) {
			throw new NotFoundError('Transaction not found')
		}

		if (pendingTx.user_id !== userId) {
			throw new BadRequestError('Transaction does not belong to user')
		}

		if (pendingTx.status === TransactionStatus.CONFIRMED) {
			throw new BadRequestError('Transaction already confirmed')
		}

		if (pendingTx.status === TransactionStatus.EXPIRED) {
			throw new BadRequestError('Transaction expired')
		}

		if (pendingTx.status === TransactionStatus.FAILED) {
			throw new BadRequestError('Transaction failed')
		}

		// Parse transaction data
		const txData = pendingTx.transaction_data as any
		const userTokenAccount = new PublicKey(txData.user_token_account)
		const deadTokenAccount = new PublicKey(txData.dead_token_account)
		const userWallet = new PublicKey(pendingTx.user_id) // Assuming user_id is wallet for now
		const expectedAmount = BigInt(txData.cost_amount)

		// Verify burn transaction on-chain
		try {
			await this.vault.verifyTokenBurn(
				signature,
				userTokenAccount,
				deadTokenAccount,
				userWallet,
				expectedAmount
			)
		} catch (error) {
			// Mark transaction as failed
			await this.transactionRepo.update(transactionId, {
				status: TransactionStatus.FAILED,
			})

			throw error
		}

		// Mark transaction as confirmed
		await this.transactionRepo.update(transactionId, {
			status: TransactionStatus.CONFIRMED,
			expected_signature: signature,
		})

		// Return pre-rolled item (actual inventory addition happens in a later phase)
		return {
			success: true,
			item: {
				itemId: txData.item_id,
				rarity: txData.item_rarity,
			},
		}
	}

	/**
	 * Pre-roll random item with cryptographic randomness
	 * Uses simple rarity system for demonstration
	 */
	private preRollItem(): { itemId: number; rarity: string } {
		// Generate cryptographically secure random number
		const randomBytes = crypto.getRandomValues(new Uint32Array(1))[0]
		const random = randomBytes / 0xffffffff // Normalize to 0-1

		// Simple rarity table (adjust probabilities as needed)
		let rarity: string
		if (random < 0.5) {
			rarity = 'common' // 50%
		} else if (random < 0.8) {
			rarity = 'rare' // 30%
		} else if (random < 0.95) {
			rarity = 'epic' // 15%
		} else {
			rarity = 'legendary' // 5%
		}

		// For now, return a mock item ID
		// In future, this would query the item_list table based on rarity
		const itemId = Math.floor(Math.random() * 100) + 1

		return { itemId, rarity }
	}
}
