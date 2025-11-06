import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase'

export interface AuthRequest extends Request {
  user: {
    id: string
    walletAddress: string
  }
}

/**
 * Middleware to require authentication via Supabase token
 * Verifies the Bearer token and attaches user info to request
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Attach user info to request
    ; (req as AuthRequest).user = {
      id: user.id,
      walletAddress: user.user_metadata?.wallet_address || user.user_metadata?.sub || '',
    }

    next()
    
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(401).json({ error: 'Token verification failed' })
  }
}

