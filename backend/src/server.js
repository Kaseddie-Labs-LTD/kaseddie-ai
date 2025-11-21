import 'dotenv/config'; // Must be at the very top
import express from 'express';
import cors from 'cors';

// Import Routers
import tradesRouter from './routes/trades.js';
import authRouter from './routes/auth.js';
import walletRouter from './routes/wallet.js';
import aiRouter from './routes/ai.js';
import tradingRouter from './routes/trading.js';
import kycRouter from './routes/kyc.js';
import marketRouter from './routes/market.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS - Allow all origins for production deployment
app.use(cors({
  origin: '*', // Allow requests from any origin (Netlify, localhost, etc.)
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'Kaseddie AI Backend Online' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/trading', tradingRouter);
app.use('/api/kyc', kycRouter);
app.use('/api/market', marketRouter);

// Mock Crypto Pulse (Keep this for the ticker)
app.get('/api/crypto-pulse', (req, res) => {
  const mockData = [
    { symbol: 'BTC', price: 43250.50, change: 2.5 },
    { symbol: 'ETH', price: 2280.75, change: -1.2 },
    { symbol: 'SOL', price: 98.30, change: 5.8 },
    { symbol: 'ADA', price: 0.58, change: 3.1 },
    { symbol: 'DOGE', price: 0.12, change: -0.5 }
  ];
  res.json(mockData);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🎃 Kaseddie AI backend haunting port ${PORT}`);
});