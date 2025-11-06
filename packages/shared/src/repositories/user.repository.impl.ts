import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'
import { TUser } from '../types/user'
import { IUserRepository } from './user.repository'

/**
 * User repository implementation
 * Provides data access operations for users using Supabase client
 */
export class UserRepository implements IUserRepository {
	
	constructor(private client: SupabaseClient<Database>) { }

	/**
	 * Get a user by their UUID (from auth.users)
	 */
	async getById(id: string): Promise<TUser | null> {
		const { data, error } = await this.client
			.from('users')
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
	 * Get a user by their wallet address
	 */
	async getByWallet(wallet: string): Promise<TUser | null> {
		const { data, error } = await this.client
			.from('users')
			.select('*')
			.eq('wallet_address', wallet)
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
}

