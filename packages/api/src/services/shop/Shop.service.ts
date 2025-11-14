import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { VaultService } from '../vault/Vault.service'
import {
	createSupabaseAdminClient,
	TransactionRepository,
	ShopRepository,
	TransactionType,
	TransactionStatus,
	BalanceBundleMetadata,
	ShopItemType,
} from '@launch-solana/shared'
import config from '../../config'
import { BadRequestError, NotFoundError } from '../../errors/AppError'

/**
 * Balance purchase response
 */
export interface BalancePurchaseResponse {
	transactionId: string
	unsignedTransaction: string
	solAmount: string
	balanceAmount: number
	expiresAt: string
}

/**
 * Balance purchase verify response
 */
export interface BalancePurchaseVerifyResponse {
	success: boolean
	balanceAdded: number
	newBalance: number
}

/**
 * Shop Service
 * Handles shop purchases (balance bundles, upgrades, etc.)
 */
export class ShopService {
	private vault: VaultService
	private transactionRepo: TransactionRepository
	private shopRepo: ShopRepository
	private supabase: ReturnType<typeof createSupabaseAdminClient>

	constructor() {
		this.vault = new VaultService()

		// Initialize Supabase admin client and repositories
		this.supabase = createSupabaseAdminClient(config.supabase.url, config.supabase.serviceKey)
		this.transactionRepo = new TransactionRepository(this.supabase)
		this.shopRepo = new ShopRepository(this.supabase)
	}

	/**
	 * Get all shop items
	 */
	async getAllItems() {
		return this.shopRepo.getAllEnabled()
	}

	/**
	 * Get shop items by type
	 */
	async getItemsByType(type: ShopItemType) {
		return this.shopRepo.getByType(type)
	}

	/**
	 * Get balance bundles
	 */
	async getBalanceBundles() {
		return this.shopRepo.getByType(ShopItemType.BALANCE)
	}

	/**
	 * Initiate balance purchase
	 * Constructs SOL transfer transaction to vault, stores pending record
	 */
	async purchaseBalance(
		userId: string,
		userWalletAddress: string,
		itemId: number
	): Promise<BalancePurchaseResponse> {
		// Get shop item
		const item = await this.shopRepo.getById(itemId)

		if (!item) {
			throw new NotFoundError('Shop item not found')
		}

		if (!item.is_enabled) {
			throw new BadRequestError('This item is not available for purchase')
		}

		if (item.item_type !== ShopItemType.BALANCE) {
			throw new BadRequestError('This item is not a balance bundle')
		}

		// Parse metadata
		const metadata = item.metadata as unknown as BalanceBundleMetadata
		if (!metadata.balance_amount) {
			throw new BadRequestError('Invalid balance bundle configuration')
		}

		// Parse SOL price (stored as decimal string, convert to lamports)
		const solPrice = parseFloat(String(item.sol_price))
		const lamports = BigInt(Math.floor(solPrice * LAMPORTS_PER_SOL))

		// Parse user wallet address
		const userWallet = new PublicKey(userWalletAddress)

		// Build unsigned SOL transfer transaction (user → vault)
		const transaction = await this.vault.buildSolTransferToVault(userWallet, lamports)

		// Serialize transaction
		const unsignedTransaction = this.vault.serializeTransaction(transaction)

		// Calculate expiration (5 minutes from now)
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

		// Store pending transaction
		const pendingTx = await this.transactionRepo.create({
			user_id: userId,
			transaction_type: TransactionType.PURCHASE_BALANCE,
			status: TransactionStatus.PENDING,
			unsigned_transaction: unsignedTransaction,
			transaction_data: {
				shop_item_id: item.id,
				item_name: item.name,
				balance_amount: metadata.balance_amount,
				sol_price: String(item.sol_price),
			},
			sol_amount: Number(lamports),
			expires_at: expiresAt.toISOString(),
		})

		return {
			transactionId: pendingTx.id,
			unsignedTransaction,
			solAmount: String(item.sol_price),
			balanceAmount: metadata.balance_amount,
			expiresAt: expiresAt.toISOString(),
		}
	}

	/**
	 * Verify balance purchase transaction
	 * Verifies SOL transfer on-chain, credits balance to user
	 */
	async verifyBalancePurchase(
		transactionId: string,
		signature: string,
		userId: string
	): Promise<BalancePurchaseVerifyResponse> {
		// Check for idempotency - if signature already used, return cached result
		const existingTx = await this.transactionRepo.getBySignature(signature)
		if (existingTx && existingTx.status === TransactionStatus.CONFIRMED) {
			const txData = existingTx.transaction_data as any

			// Get current balance
			const { data: user } = await this.supabase
				.from('users')
				.select('balance')
				.eq('id', userId)
				.single()

			return {
				success: true,
				balanceAdded: txData.balance_amount,
				newBalance: user?.balance || 0,
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
		const expectedLamports = BigInt(pendingTx.sol_amount || 0)

		// Get user wallet address (for now, assume user_id is the wallet - we'll improve this later)
		const userWalletPubkey = new PublicKey(userId)

		// Verify SOL transfer on-chain
		try {
			await this.vault.verifySolTransfer(
				signature,
				userWalletPubkey,
				this.vault.getVaultPublicKey(),
				expectedLamports
			)
		} catch (error) {
			// Mark transaction as failed
			await this.transactionRepo.update(transactionId, {
				status: TransactionStatus.FAILED,
			})

			throw error
		}

		// Get current user balance
		const { data: currentUser } = await this.supabase
			.from('users')
			.select('balance')
			.eq('id', userId)
			.single()

		const currentBalance = currentUser?.balance || 0
		const newBalance = currentBalance + txData.balance_amount

		// Credit balance to user
		const { data: updatedUser, error } = await this.supabase
			.from('users')
			.update({ balance: newBalance })
			.eq('id', userId)
			.select('balance')
			.single()

		if (error) {
			throw error
		}

		// Mark transaction as confirmed
		await this.transactionRepo.update(transactionId, {
			status: TransactionStatus.CONFIRMED,
			expected_signature: signature,
		})

		return {
			success: true,
			balanceAdded: txData.balance_amount,
			newBalance: updatedUser?.balance || 0,
		}
	}
}
