import axios from 'axios';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;

// Symbols we want to track
const TRACKED_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'SOLUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'XRPUSDT'
];

/**
 * Get real-time market prices from Binance
 * @returns {Promise<Array>} Array of market data
 */
export async function getMarketPrices() {
  try {
    const headers = {};
    if (BINANCE_API_KEY && BINANCE_API_KEY !== 'placeholder') {
      headers['X-MBX-APIKEY'] = BINANCE_API_KEY;
    }

    const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`, {
      headers,
      timeout: 60000 // 60 second timeout for slow connections
    });

    // Filter for our tracked symbols and format the data
    const marketData = response.data
      .filter(ticker => TRACKED_SYMBOLS.includes(ticker.symbol))
      .map(ticker => ({
        symbol: ticker.symbol.replace('USDT', ''), // BTC, ETH, etc.
        price: parseFloat(ticker.lastPrice),
        change: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice)
      }));

    return marketData;
  } catch (error) {
    console.error('Binance API error:', error.message);
    throw new Error('Failed to fetch market prices from Binance');
  }
}

/**
 * Get price for a specific symbol
 * @param {string} symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Object>} Market data for the symbol
 */
export async function getSymbolPrice(symbol) {
  const prices = await getMarketPrices();
  const symbolData = prices.find(p => p.symbol === symbol.toUpperCase());
  
  if (!symbolData) {
    throw new Error(`Symbol ${symbol} not found in tracked symbols`);
  }
  
  return symbolData;
}
