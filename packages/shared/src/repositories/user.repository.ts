import { TUser } from '../types/user'

/**
 * User repository interface
 * Defines the contract for user data access operations
 */
export interface IUserRepository {
	/**
	 * Get a user by their UUID (from auth.users)
	 */
	getById(id: string): Promise<TUser | null>

	/**
	 * Get a user by their wallet address
	 */
	getByWallet(wallet: string): Promise<TUser | null>
}

