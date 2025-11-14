import { Database } from '../lib/database.types'

export type TShopItem = Database['public']['Tables']['shop_items']['Row']
export type TShopItemInsert = Database['public']['Tables']['shop_items']['Insert']
export type TShopItemUpdate = Database['public']['Tables']['shop_items']['Update']

/**
 * Shop item type enum
 */
export enum ShopItemType {
	BALANCE = 'balance',
	UPGRADE = 'upgrade',
	BUILDING = 'building',
	BUILDING_SLOT = 'building_slot',
	ENERGY_BUNDLE = 'energy_bundle',
	COSMETIC = 'cosmetic',
	BOOST = 'boost',
}

/**
 * Balance bundle metadata
 */
export interface BalanceBundleMetadata {
	balance_amount: number
}

/**
 * Generic shop item with typed metadata
 */
export interface ShopItemWithMetadata<T = any> extends Omit<TShopItem, 'metadata'> {
	metadata: T
}
