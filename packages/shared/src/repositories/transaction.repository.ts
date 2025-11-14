import { TPendingTransaction, TPendingTransactionInsert, TPendingTransactionUpdate } from '../types/transaction'

/**
 * Transaction repository interface
 * Defines the contract for transaction data access operations
 */
export interface ITransactionRepository {
	/**
	 * Create a new pending transaction
	 */
	create(transaction: TPendingTransactionInsert): Promise<TPendingTransaction>

	/**
	 * Get a pending transaction by its ID
	 */
	getById(id: string): Promise<TPendingTransaction | null>

	/**
	 * Get a pending transaction by its signature
	 */
	getBySignature(signature: string): Promise<TPendingTransaction | null>

	/**
	 * Update a pending transaction
	 */
	update(id: string, updates: TPendingTransactionUpdate): Promise<TPendingTransaction>

	/**
	 * Get all pending transactions for a user
	 */
	getByUserId(userId: string): Promise<TPendingTransaction[]>

	/**
	 * Mark expired transactions as expired
	 */
	expireOldTransactions(): Promise<number>
}
