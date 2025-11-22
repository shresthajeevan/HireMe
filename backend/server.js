// Load environment variables FIRST before any imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import generateRouter from './routes/generate.js';
import pdfRouter from './routes/pdf.js';
import chatRouter from './routes/chat.js';

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
    console.error('Please create a .env file with your Gemini API key');
    console.error('Get your free API key from: https://makersuite.google.com/app/apikey');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
// CORS configuration – only allow frontend origin
const allowedOrigins = ['http://localhost:8080'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware – JSON parsing only (no request logging)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/generate', generateRouter);
app.use('/api/pdf', pdfRouter);
app.use('/api/chat', chatRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Resume Builder Backend API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            generate: 'POST /api/generate',
            pdf: 'POST /api/pdf'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Resume Builder Backend Server`);
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
    console.log('='.repeat(50));
});

export default app;
