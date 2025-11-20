import express from 'express';

const router = express.Router();

const mockTrades = [
  { id: 1, symbol: 'BTC', type: 'BUY', amount: 0.05, price: 42800, profit: 125.50, timestamp: '2025-10-31T23:45:00Z' },
  { id: 2, symbol: 'ETH', type: 'SELL', amount: 2.5, price: 2300, profit: -45.20, timestamp: '2025-10-31T22:30:00Z' },
  { id: 3, symbol: 'SOL', type: 'BUY', amount: 10, price: 95.50, profit: 280.00, timestamp: '2025-10-31T21:15:00Z' }
];

router.get('/', (req, res) => {
  res.json(mockTrades);
});

export default router;
