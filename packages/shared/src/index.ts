// Database types
export type { Database } from './lib/database.types'

// User types
export type { TUser } from './types/user'

// Transaction types
export type {
	TPendingTransaction,
	TPendingTransactionInsert,
	TPendingTransactionUpdate,
} from './types/transaction'
export { TransactionStatus, TransactionType } from './types/transaction'

// Shop types
export type {
	TShopItem,
	TShopItemInsert,
	TShopItemUpdate,
	ShopItemWithMetadata,
	BalanceBundleMetadata,
} from './types/shop'
export { ShopItemType } from './types/shop'

/** Supabase Clients */
export { createSupabaseClient } from './lib/supabase-client'
export { createSupabaseAdminClient } from './lib/supabase-admin-client'

/** Repositories */
export { UserRepository } from './repositories/user.repository.impl'
export type { IUserRepository } from './repositories/user.repository'

export { TransactionRepository } from './repositories/transaction.repository.impl'
export type { ITransactionRepository } from './repositories/transaction.repository'

export { ShopRepository } from './repositories/shop.repository.impl'
export type { IShopRepository } from './repositories/shop.repository'

