import app from './app';
import cors from 'cors';

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`NBP API URL: ${process.env.NBP_API_URL}`);
	console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graeful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received. Shutting down gracefully...');
	server.close(() => {
		console.log('Process terminated');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('SIGINT received. Shutting down gracefully...');
	server.close(() => {
		console.log('Process terminated');
		process.exit(0);
	});
});
