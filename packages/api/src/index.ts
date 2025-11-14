import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import 'express-async-errors'
import config from './config'
import logger from './logger/Logger'

// Import routes
import apiRouter from './routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({ origin: config.corsOrigin }))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === 'production' ? 100 : 1000,
})
app.use(limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: config.nodeEnv })
})

// API Routes

// Mount api routes
app.use('/api', apiRouter)




// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error('Error occurred', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    })

    res.status(500).json({
      error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    })
  }
)

app.listen(config.port, () => {
  logger.info(`API running on port ${config.port} in ${config.nodeEnv} mode`)
})

export { app }