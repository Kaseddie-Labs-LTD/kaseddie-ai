import express from 'express';
import { getMarketPrices } from '../services/binanceService.js';

const router = express.Router();

/**
 * GET /api/market/prices
 * Get real-time market prices from Binance
 */
router.get('/prices', async (req, res) => {
  try {
    const prices = await getMarketPrices();
    res.json(prices);
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market prices',
      message: error.message 
    });
  }
});

export default router;
