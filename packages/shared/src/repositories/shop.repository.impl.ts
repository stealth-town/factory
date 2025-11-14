import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'
import { TShopItem, ShopItemType } from '../types/shop'
import { IShopRepository } from './shop.repository'

/**
 * Shop repository implementation
 * Provides data access operations for shop items using Supabase client
 */
export class ShopRepository implements IShopRepository {
	constructor(private client: SupabaseClient<Database>) {}

	/**
	 * Get all enabled shop items
	 */
	async getAllEnabled(): Promise<TShopItem[]> {
		const { data, error } = await this.client
			.from('shop_items')
			.select('*')
			.eq('is_enabled', true)
			.order('display_order', { ascending: true })

		if (error) {
			throw error
		}

		return data
	}

	/**
	 * Get enabled shop items by type
	 */
	async getByType(type: ShopItemType): Promise<TShopItem[]> {
		const { data, error } = await this.client
			.from('shop_items')
			.select('*')
			.eq('item_type', type)
			.eq('is_enabled', true)
			.order('display_order', { ascending: true })

		if (error) {
			throw error
		}

		return data
	}

	/**
	 * Get a shop item by ID
	 */
	async getById(id: number): Promise<TShopItem | null> {
		const { data, error } = await this.client
			.from('shop_items')
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
	 * Get featured items
	 */
	async getFeatured(): Promise<TShopItem[]> {
		const { data, error } = await this.client
			.from('shop_items')
			.select('*')
			.eq('is_featured', true)
			.eq('is_enabled', true)
			.order('display_order', { ascending: true })

		if (error) {
			throw error
		}

		return data
	}
}
