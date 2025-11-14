import { Database } from '../lib/database.types'

export type TPendingTransaction = Database['public']['Tables']['pending_transactions']['Row']
export type TPendingTransactionInsert = Database['public']['Tables']['pending_transactions']['Insert']
export type TPendingTransactionUpdate = Database['public']['Tables']['pending_transactions']['Update']

/**
 * Transaction status enum
 */
export enum TransactionStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	FAILED = 'failed',
	EXPIRED = 'expired',
}

/**
 * Transaction type enum
 */
export enum TransactionType {
	PURCHASE_ITEM = 'purchase_item',
	PURCHASE_BALANCE = 'purchase_balance',
	GACHA_ROLL = 'gacha_roll',
	CLAIM_REWARDS = 'claim_rewards',
	TOKEN_REWARD = 'token_reward',
	ADMIN_ACTION = 'admin_action',
}
