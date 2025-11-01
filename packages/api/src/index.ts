import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';



const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';



// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: NODE_ENV === 'production' ? 100 : 1000
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: NODE_ENV });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

app.listen(PORT, () => {
    console.log(` API running on port ${PORT} in ${NODE_ENV} mode`);
});

export { app };