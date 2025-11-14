import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'
import { TPendingTransaction, TPendingTransactionInsert, TPendingTransactionUpdate } from '../types/transaction'
import { ITransactionRepository } from './transaction.repository'

/**
 * Transaction repository implementation
 * Provides data access operations for pending transactions using Supabase client
 */
export class TransactionRepository implements ITransactionRepository {
	constructor(private client: SupabaseClient<Database>) {}

	/**
	 * Create a new pending transaction
	 */
	async create(transaction: TPendingTransactionInsert): Promise<TPendingTransaction> {
		const { data, error } = await this.client
			.from('pending_transactions')
			.insert(transaction)
			.select()
			.single()

		if (error) {
			throw error
		}

		return data
	}

	/**
	 * Get a pending transaction by its ID
	 */
	async getById(id: string): Promise<TPendingTransaction | null> {
		const { data, error } = await this.client
			.from('pending_transactions')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			// If no rows found, return null instead of throwing
			if (error.code === 'PGRST116') {
				return null
			}
			throw error
		}

		return data
	}

	/**
	 * Get a pending transaction by its signature (for idempotency)
	 */
	async getBySignature(signature: string): Promise<TPendingTransaction | null> {
		const { data, error } = await this.client
			.from('pending_transactions')
			.select('*')
			.eq('expected_signature', signature)
			.single()

		if (error) {
			// If no rows found, return null instead of throwing
			if (error.code === 'PGRST116') {
				return null
			}
			throw error
		}

		return data
	}

	/**
	 * Update a pending transaction
	 */
	async update(id: string, updates: TPendingTransactionUpdate): Promise<TPendingTransaction> {
		const { data, error } = await this.client
			.from('pending_transactions')
			.update(updates)
			.eq('id', id)
			.select()
			.single()

		if (error) {
			throw error
		}

		return data
	}

	/**
	 * Get all pending transactions for a user
	 */
	async getByUserId(userId: string): Promise<TPendingTransaction[]> {
		const { data, error } = await this.client
			.from('pending_transactions')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })

		if (error) {
			throw error
		}

		return data
	}

	/**
	 * Mark expired transactions as expired
	 * Calls the database function to expire old transactions
	 */
	async expireOldTransactions(): Promise<number> {
		const { data, error } = await this.client.rpc('expire_old_transactions')

		if (error) {
			throw error
		}

		return data as number
	}
}
