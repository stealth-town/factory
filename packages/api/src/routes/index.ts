import { Router } from 'express'

// Import routes
import gachaRouter from './Gacha/Gacha.route'
import transactionsRouter from './Transactions/Transactions.route'
import shopRouter from './Shop/Shop.route'

/**
 * Create a router and mount other routes
 * onto it
 */

const apiRouter = Router()

// Mount routes
apiRouter.use('/gacha', gachaRouter)
apiRouter.use('/transactions', transactionsRouter)
apiRouter.use('/shop', shopRouter)

export default apiRouter;