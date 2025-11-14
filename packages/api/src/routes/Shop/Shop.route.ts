import { Router, Request, Response } from 'express'
import { ShopService } from '../../services/shop/Shop.service'
import { requireAuth } from '../../middleware/auth.middleware'
import { z } from 'zod'
import { BadRequestError } from '../../errors/AppError'
import { ShopItemType } from '@launch-solana/shared'

/**
 * Create shop routes
 */
const shopRouter = Router()
const shopService = new ShopService()

/**
 * GET /api/shop/items
 * Get all enabled shop items
 * Public route (no auth required for browsing)
 */
shopRouter.get('/items', async (req: Request, res: Response) => {
	try {
		const items = await shopService.getAllItems()
		res.json({ items })
	} catch (error) {
		throw error
	}
})

/**
 * GET /api/shop/items/balance
 * Get all balance bundles
 * Public route
 */
shopRouter.get('/items/balance', async (req: Request, res: Response) => {
	try {
		const items = await shopService.getBalanceBundles()
		res.json({ items })
	} catch (error) {
		throw error
	}
})

/**
 * GET /api/shop/items/:type
 * Get shop items by type
 * Public route
 */
shopRouter.get('/items/:type', async (req: Request, res: Response) => {
	try {
		const { type } = req.params

		// Validate type
		const schema = z.nativeEnum(ShopItemType)
		const itemType = schema.parse(type)

		const items = await shopService.getItemsByType(itemType)
		res.json({ items })
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Invalid item type', error.issues as any)
		}
		throw error
	}
})

/**
 * POST /api/shop/purchase/balance
 * Initiate balance purchase (construct SOL transfer transaction)
 * Protected route - requires authentication
 */
shopRouter.post('/purchase/balance', requireAuth, async (req: Request, res: Response) => {
	try {
		// Validate request body
		const schema = z.object({
			itemId: z.number().int().positive('Item ID must be a positive integer'),
			walletAddress: z.string().min(32, 'Invalid wallet address'),
		})

		const { itemId, walletAddress } = schema.parse(req.body)

		// Get user ID from auth
		const userId = (req as any).user?.id
		if (!userId) {
			throw new BadRequestError('User not authenticated')
		}

		// Purchase balance
		const result = await shopService.purchaseBalance(userId, walletAddress, itemId)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Validation failed', error.issues as any)
		}
		throw error
	}
})

/**
 * POST /api/shop/verify/balance
 * Verify balance purchase transaction on-chain
 * Protected route - requires authentication
 */
shopRouter.post('/verify/balance', requireAuth, async (req: Request, res: Response) => {
	try {
		// Validate request body
		const schema = z.object({
			transactionId: z.string().uuid('Invalid transaction ID'),
			signature: z.string().min(1, 'Signature is required'),
		})

		const { transactionId, signature } = schema.parse(req.body)

		// Get user ID from auth
		const userId = (req as any).user?.id
		if (!userId) {
			throw new BadRequestError('User not authenticated')
		}

		// Verify transaction
		const result = await shopService.verifyBalancePurchase(transactionId, signature, userId)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Validation failed', error.issues as any)
		}
		throw error
	}
})

export default shopRouter
