import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import currencyRoutes from './routes/currency';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
		credentials: true,
	}),
);

// Rate limiting
const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
	message: {
		success: false,
		message: 'Too many requests, please try again later.',
	},
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Debug logging
app.use((req, res, next) => {
	console.log(`Request: ${req.method} ${req.path}`);
	if (req.method === 'POST') {
		console.log('Body:', req.body);
	}
	next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'Currency Exchange API is running',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	});
});

// Routes
app.use('/api/currency', currencyRoutes);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Endpoint not found',
	});
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error('Error:', err);

	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal server error',
		...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
	});
});

export default app;
