import { TShopItem, ShopItemType } from '../types/shop'

/**
 * Shop repository interface
 * Defines the contract for shop item data access operations
 */
export interface IShopRepository {
	/**
	 * Get all enabled shop items
	 */
	getAllEnabled(): Promise<TShopItem[]>

	/**
	 * Get enabled shop items by type
	 */
	getByType(type: ShopItemType): Promise<TShopItem[]>

	/**
	 * Get a shop item by ID
	 */
	getById(id: number): Promise<TShopItem | null>

	/**
	 * Get featured items
	 */
	getFeatured(): Promise<TShopItem[]>
}
