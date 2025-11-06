import { Router } from 'express'
import { z } from 'zod'
import { loginWithWallet } from '../services/auth.service'

const router = Router()

const loginSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
})

/**
 * POST /api/auth/login
 * Authenticate user with wallet signature
 */
router.post('/login', async (req, res, next) => {
  try {
    const validated = loginSchema.safeParse(req.body)
    
    if (!validated.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validated.error.errors,
      })
    }

    const { walletAddress, signature, message } = validated.data
    
    const result = await loginWithWallet(walletAddress, signature, message)
    
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

export default router

