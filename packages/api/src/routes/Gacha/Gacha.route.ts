import { Router, Request, Response } from 'express'
import { GachaService } from '../../services/gacha/Gacha.service'
import { requireAuth } from '../../middleware/auth.middleware'
import { z } from 'zod'
import { BadRequestError } from '../../errors/AppError'

/**
 * Create gacha routes
 */
const gachaRouter = Router()
const gachaService = new GachaService()

/**
 * POST /api/gacha/purchase
 * Initiate gacha purchase (pre-roll item, construct burn transaction)
 * Protected route - requires authentication
 */
gachaRouter.post('/purchase', requireAuth, async (req: Request, res: Response) => {
	try {
		// Validate request body
		const schema = z.object({
			walletAddress: z.string().min(32, 'Invalid wallet address'),
		})

		const { walletAddress } = schema.parse(req.body)

		// Get user ID from auth (assuming req.user is set by requireAuth middleware)
		const userId = (req as any).user?.id
		if (!userId) {
			throw new BadRequestError('User not authenticated')
		}

		// Purchase gacha
		const result = await gachaService.purchaseGacha(userId, walletAddress)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Validation failed', error.issues as any)
		}
		throw error
	}
})

/**
 * POST /api/gacha/verify
 * Verify gacha purchase transaction on-chain
 * Protected route - requires authentication
 */
gachaRouter.post('/verify', requireAuth, async (req: Request, res: Response) => {
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
		const result = await gachaService.verifyGachaPurchase(transactionId, signature, userId)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Validation failed', error.issues as any)
		}
		throw error
	}
})

export default gachaRouter
