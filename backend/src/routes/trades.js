import express from 'express';
import { getAll } from '../models/db.js';

const router = express.Router();

// GET /api/trades
// Returns ALL trades from the database (Real Data)
router.get('/', (req, res) => {
  try {
    const trades = getAll('trades');
    
    // Sort by newest first
    const sortedTrades = trades.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json(sortedTrades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Failed to fetch trade history' });
  }
});

export default router;