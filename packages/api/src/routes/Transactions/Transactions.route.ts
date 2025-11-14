import { Router, Request, Response } from 'express'
import { GachaService } from '../../services/gacha/Gacha.service'
import { requireAuth } from '../../middleware/auth.middleware'
import { z } from 'zod'
import { BadRequestError } from '../../errors/AppError'

/**
 * Create transactions routes
 */
const transactionsRouter = Router()

/**
 * POST /api/transactions/:id/verify
 * Universal transaction verification endpoint
 * Verifies any transaction type on-chain and updates game state
 * Protected route - requires authentication
 */
transactionsRouter.post('/:id/verify', requireAuth, async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		// Validate UUID
		const idSchema = z.string().uuid('Invalid transaction ID')
		const transactionId = idSchema.parse(id)

		// Validate request body
		const schema = z.object({
			signature: z.string().min(1, 'Signature is required'),
		})

		const { signature } = schema.parse(req.body)

		// Get user ID from auth
		const userId = (req as any).user?.id
		if (!userId) {
			throw new BadRequestError('User not authenticated')
		}

		// For now, we only support gacha transactions
		// In the future, this will route to different services based on transaction_type
		const gachaService = new GachaService()
		const result = await gachaService.verifyGachaPurchase(transactionId, signature, userId)

		res.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new BadRequestError('Validation failed', error.issues as any)
		}
		throw error
	}
})

export default transactionsRouter
