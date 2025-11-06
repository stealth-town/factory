import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.nodeEnv === 'production' ? 100 : 1000
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: config.nodeEnv });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: config.nodeEnv === 'production' ? 'Internal server error' : err.message 
    });
});

app.listen(config.port, () => {
    console.log(`API running on port ${config.port} in ${config.nodeEnv} mode`);
});

export { app };