/**
 * Kaseddie AI Trading Engine
 * 8 Advanced Trading Strategies
 */

import { getTradeAnalysis } from './aiService.js';
import { getSymbolPrice } from './binanceService.js';

/**
 * Calculate Stop Loss and Take Profit levels based on price and decision
 * @param {number} price - Current price
 * @param {string} decision - Trade decision (BUY/SELL)
 * @returns {Object} Stop loss and take profit levels
 */
function calculateRiskLevels(price, decision) {
  if (decision === 'BUY') {
    return {
      stopLoss: price * 0.98,  // -2% stop loss
      takeProfit: price * 1.04  // +4% take profit
    };
  } else if (decision === 'SELL') {
    return {
      stopLoss: price * 1.02,  // +2% stop loss
      takeProfit: price * 0.96  // -4% take profit
    };
  }
  
  // For HOLD, return null values
  return {
    stopLoss: null,
    takeProfit: null
  };
}

/**
 * Get realistic fallback price for a symbol
 * @param {string} symbol - Crypto symbol
 * @returns {number} Fallback price
 */
function getFallbackPrice(symbol) {
  const symbolUpper = symbol.toUpperCase();
  const realisticPrices = {
    'BTC': 90000,
    'ETH': 3200,
    'SOL': 150,
    'ADA': 0.65,
    'DOGE': 0.15,
    'XRP': 0.70,
    'MATIC': 0.90,
    'DOT': 8.50,
    'AVAX': 40,
    'LINK': 18
  };
  
  return realisticPrices[symbolUpper] || 100;
}

/**
 * Get real market data from Binance or generate mock data as fallback
 * @param {string} symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Object>} Market data
 */
async function getMarketData(symbol) {
  // Normalize symbol to uppercase
  const normalizedSymbol = symbol.toUpperCase();
  
  try {
    // Try to get real data from Binance
    const binanceData = await getSymbolPrice(normalizedSymbol);
    
    // Validate that we got a valid price
    if (!binanceData || !binanceData.price || isNaN(binanceData.price)) {
      throw new Error('Invalid price data from Binance');
    }
    
    // Enhance with calculated indicators
    return {
      symbol: binanceData.symbol,
      currentPrice: binanceData.price,
      volume: binanceData.volume || 1000000,
      high24h: binanceData.high24h || binanceData.price * 1.05,
      low24h: binanceData.low24h || binanceData.price * 0.95,
      change24h: binanceData.change?.toFixed(2) || '0.00',
      rsi: Math.random() * 100, // TODO: Calculate real RSI
      macd: Math.random() * 2 - 1, // TODO: Calculate real MACD
      movingAverage50: binanceData.price * 0.98, // TODO: Calculate real MA50
      movingAverage200: binanceData.price * 0.95, // TODO: Calculate real MA200
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Failed to get real data for ${normalizedSymbol}, using fallback:`, error.message);
    
    // Use realistic fallback price
    const fallbackPrice = getFallbackPrice(normalizedSymbol);
    const volatility = Math.random() * 0.05 - 0.025; // -2.5% to +2.5%
    const currentPrice = fallbackPrice * (1 + volatility);

    return {
      symbol: normalizedSymbol,
      currentPrice: currentPrice,
      volume: Math.random() * 1000000 + 500000,
      high24h: currentPrice * 1.08,
      low24h: currentPrice * 0.92,
      change24h: (Math.random() * 10 - 5).toFixed(2),
      rsi: Math.random() * 100,
      macd: Math.random() * 2 - 1,
      movingAverage50: currentPrice * 0.98,
      movingAverage200: currentPrice * 0.95,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Strategy 1: Momentum Trading
 * Buys when price momentum is strong and upward
 */
export function momentumStrategy(marketData) {
  const { symbol, currentPrice, change24h, rsi, volume } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'Neutral momentum';

  if (parseFloat(change24h) > 3 && rsi < 70 && volume > 500000) {
    decision = 'BUY';
    confidence = 75 + Math.floor(Math.random() * 15);
    reasoning = 'Strong upward momentum with healthy RSI';
  } else if (parseFloat(change24h) < -3 && rsi > 30) {
    decision = 'SELL';
    confidence = 70 + Math.floor(Math.random() * 15);
    reasoning = 'Negative momentum detected';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'Momentum',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 2: Mean Reversion
 * Buys when price is below average, sells when above
 */
export function meanReversionStrategy(marketData) {
  const { symbol, currentPrice, movingAverage50, rsi } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'Price near average';

  const deviation = ((currentPrice - movingAverage50) / movingAverage50) * 100;

  if (deviation < -5 && rsi < 40) {
    decision = 'BUY';
    confidence = 70 + Math.floor(Math.random() * 20);
    reasoning = 'Price significantly below mean, oversold';
  } else if (deviation > 5 && rsi > 60) {
    decision = 'SELL';
    confidence = 65 + Math.floor(Math.random() * 20);
    reasoning = 'Price significantly above mean, overbought';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'Mean Reversion',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 3: Breakout Trading
 * Identifies and trades breakouts from consolidation
 */
export function breakoutStrategy(marketData) {
  const { symbol, currentPrice, high24h, low24h, volume } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'No breakout detected';

  const range = high24h - low24h;
  const position = (currentPrice - low24h) / range;

  if (position > 0.9 && volume > 600000) {
    decision = 'BUY';
    confidence = 80 + Math.floor(Math.random() * 15);
    reasoning = 'Upward breakout with strong volume';
  } else if (position < 0.1 && volume > 600000) {
    decision = 'SELL';
    confidence = 75 + Math.floor(Math.random() * 15);
    reasoning = 'Downward breakout detected';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'Breakout',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 4: RSI Divergence
 * Trades based on RSI overbought/oversold conditions
 */
export function rsiDivergenceStrategy(marketData) {
  const { symbol, currentPrice, rsi, change24h } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'RSI in neutral zone';

  if (rsi < 30) {
    decision = 'BUY';
    confidence = 75 + Math.floor(Math.random() * 20);
    reasoning = 'RSI oversold, potential reversal';
  } else if (rsi > 70) {
    decision = 'SELL';
    confidence = 70 + Math.floor(Math.random() * 20);
    reasoning = 'RSI overbought, potential correction';
  } else if (rsi < 40 && parseFloat(change24h) < -2) {
    decision = 'BUY';
    confidence = 65 + Math.floor(Math.random() * 15);
    reasoning = 'Bullish divergence forming';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'RSI Divergence',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 5: MACD Crossover
 * Trades based on MACD signal line crossovers
 */
export function macdCrossoverStrategy(marketData) {
  const { symbol, currentPrice, macd, change24h } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'No clear MACD signal';

  if (macd > 0.5 && parseFloat(change24h) > 0) {
    decision = 'BUY';
    confidence = 70 + Math.floor(Math.random() * 20);
    reasoning = 'Bullish MACD crossover';
  } else if (macd < -0.5 && parseFloat(change24h) < 0) {
    decision = 'SELL';
    confidence = 68 + Math.floor(Math.random() * 20);
    reasoning = 'Bearish MACD crossover';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'MACD Crossover',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 6: Volume Spike
 * Identifies unusual volume patterns
 */
export function volumeSpikeStrategy(marketData) {
  const { symbol, currentPrice, volume, change24h } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'Normal volume';

  const avgVolume = 500000;
  const volumeRatio = volume / avgVolume;

  if (volumeRatio > 2 && parseFloat(change24h) > 2) {
    decision = 'BUY';
    confidence = 80 + Math.floor(Math.random() * 15);
    reasoning = 'Massive volume spike with price increase';
  } else if (volumeRatio > 2 && parseFloat(change24h) < -2) {
    decision = 'SELL';
    confidence = 75 + Math.floor(Math.random() * 15);
    reasoning = 'Volume spike with price decline';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'Volume Spike',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 7: Support/Resistance
 * Trades based on key support and resistance levels
 */
export function supportResistanceStrategy(marketData) {
  const { symbol, currentPrice, high24h, low24h, movingAverage200 } = marketData;
  
  let decision = 'HOLD';
  let confidence = 50;
  let reasoning = 'Price between levels';

  const support = Math.min(low24h, movingAverage200);
  const resistance = high24h;

  const distanceToSupport = ((currentPrice - support) / support) * 100;
  const distanceToResistance = ((resistance - currentPrice) / currentPrice) * 100;

  if (distanceToSupport < 2) {
    decision = 'BUY';
    confidence = 75 + Math.floor(Math.random() * 20);
    reasoning = 'Price near strong support level';
  } else if (distanceToResistance < 2) {
    decision = 'SELL';
    confidence = 70 + Math.floor(Math.random() * 20);
    reasoning = 'Price near resistance level';
  }

  const riskLevels = calculateRiskLevels(currentPrice, decision);

  return {
    strategy: 'Support/Resistance',
    symbol,
    decision,
    price: currentPrice,
    confidence,
    reasoning,
    stopLoss: riskLevels.stopLoss,
    takeProfit: riskLevels.takeProfit,
    timestamp: new Date().toISOString()
  };
}

/**
 * Strategy 8: Trend Following (AI-Powered)
 * Uses Google AI with real-time news analysis
 */
export async function trendFollowingStrategy(marketData) {
  const { symbol, currentPrice } = marketData;
  
  try {
    // Call AI service to get analysis based on real-time news
    console.log(`Trend Following: Getting AI analysis for ${symbol}...`);
    const aiAnalysis = await getTradeAnalysis(symbol);
    
    const riskLevels = calculateRiskLevels(currentPrice, aiAnalysis.decision);

    return {
      strategy: 'Trend Following',
      symbol,
      decision: aiAnalysis.decision,
      price: currentPrice,
      confidence: aiAnalysis.confidence,
      reasoning: aiAnalysis.reasoning,
      newsImpact: aiAnalysis.newsImpact,
      riskLevel: aiAnalysis.riskLevel,
      timeframe: aiAnalysis.timeframe,
      newsCount: aiAnalysis.newsCount,
      stopLoss: riskLevels.stopLoss,
      takeProfit: riskLevels.takeProfit,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI analysis failed, falling back to technical analysis:', error.message);
    
    // Fallback to technical analysis if AI fails
    const { movingAverage50, movingAverage200, change24h } = marketData;
    
    let decision = 'HOLD';
    let confidence = 50;
    let reasoning = 'No clear trend (AI unavailable)';

    const goldenCross = movingAverage50 > movingAverage200;
    const deathCross = movingAverage50 < movingAverage200;

    if (goldenCross && currentPrice > movingAverage50 && parseFloat(change24h) > 0) {
      decision = 'BUY';
      confidence = 85 + Math.floor(Math.random() * 10);
      reasoning = 'Golden cross confirmed, strong uptrend';
    } else if (deathCross && currentPrice < movingAverage50 && parseFloat(change24h) < 0) {
      decision = 'SELL';
      confidence = 80 + Math.floor(Math.random() * 10);
      reasoning = 'Death cross confirmed, downtrend';
    } else if (goldenCross) {
      decision = 'BUY';
      confidence = 65 + Math.floor(Math.random() * 15);
      reasoning = 'Uptrend in progress';
    }

    const riskLevels = calculateRiskLevels(currentPrice, decision);

    return {
      strategy: 'Trend Following',
      symbol,
      decision,
      price: currentPrice,
      confidence,
      reasoning,
      stopLoss: riskLevels.stopLoss,
      takeProfit: riskLevels.takeProfit,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Main function to get trade signal based on strategy
 * @param {string} strategyName - Name of the strategy to use
 * @param {string} symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @param {Object} marketData - Optional market data (will fetch real data if not provided)
 * @returns {Promise<Object>} Trade signal with decision, price, and confidence
 */
export async function getTradeSignal(strategyName, symbol, marketData = null) {
  // Get real market data from Binance if not provided
  const data = marketData || await getMarketData(symbol);

  // Map strategy names to functions
  const strategies = {
    'momentum': momentumStrategy,
    'mean-reversion': meanReversionStrategy,
    'breakout': breakoutStrategy,
    'rsi-divergence': rsiDivergenceStrategy,
    'macd-crossover': macdCrossoverStrategy,
    'volume-spike': volumeSpikeStrategy,
    'support-resistance': supportResistanceStrategy,
    'trend-following': trendFollowingStrategy
  };

  const strategyKey = strategyName.toLowerCase();
  const strategyFunction = strategies[strategyKey];

  if (!strategyFunction) {
    throw new Error(`Unknown strategy: ${strategyName}. Available strategies: ${Object.keys(strategies).join(', ')}`);
  }

  // Call strategy function (await if it's the async trend-following strategy)
  return await strategyFunction(data);
}

/**
 * Get all available strategies
 * @returns {Array} List of strategy names
 */
export function getAvailableStrategies() {
  return [
    { name: 'momentum', description: 'Trades based on price momentum and trend strength' },
    { name: 'mean-reversion', description: 'Buys low, sells high based on price deviation from average' },
    { name: 'breakout', description: 'Identifies and trades breakouts from consolidation patterns' },
    { name: 'rsi-divergence', description: 'Uses RSI to identify overbought/oversold conditions' },
    { name: 'macd-crossover', description: 'Trades based on MACD signal line crossovers' },
    { name: 'volume-spike', description: 'Identifies unusual volume patterns for entry/exit' },
    { name: 'support-resistance', description: 'Trades at key support and resistance levels' },
    { name: 'trend-following', description: 'Follows long-term trends using moving averages' }
  ];
}
