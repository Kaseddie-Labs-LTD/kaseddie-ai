import axios from 'axios';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI with project credentials (Europe region for better connectivity)
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID || 'kaseddie-ai',
  location: 'europe-west1'
});

// Get the Gemini Pro model
const model = vertexAI.preview.getGenerativeModel({
  model: 'gemini-2.0-flash-001'
});

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsdata.io/api/1/news';

/**
 * Helper function to retry AI generation with exponential backoff
 * @param {string} prompt - The prompt to send to the AI
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Object>} AI response
 */
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI generation attempt ${attempt}/${maxRetries}...`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const waitTime = 1000 * attempt; // 1s, 2s, 3s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw new Error(`AI generation failed after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * Fetch real-time news for a cryptocurrency symbol
 * @param {string} symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Array>} Array of news articles
 */
export async function fetchRealTimeNews(symbol) {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'placeholder') {
    console.warn('News API key not configured, using mock data');
    return [
      {
        title: `${symbol} shows strong momentum in crypto markets`,
        description: 'Market analysis indicates positive trends',
        pubDate: new Date().toISOString()
      }
    ];
  }

  try {
    // Map common crypto symbols to full names for better news results
    const symbolMap = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'ADA': 'Cardano',
      'DOGE': 'Dogecoin',
      'XRP': 'Ripple',
      'MATIC': 'Polygon',
      'DOT': 'Polkadot'
    };

    const searchTerm = symbolMap[symbol.toUpperCase()] || symbol;
    
    const response = await axios.get(NEWS_API_URL, {
      params: {
        apikey: NEWS_API_KEY,
        q: `${searchTerm} cryptocurrency`,
        language: 'en',
        category: 'business,technology'
      },
      timeout: 10000
    });

    if (response.data && response.data.results) {
      return response.data.results.slice(0, 5); // Get top 5 news articles
    }

    return [];
  } catch (error) {
    console.error('News API error:', error.message);
    // Return empty array on error, AI will work without news
    return [];
  }
}

/**
 * Get trade analysis for a specific crypto symbol using real-time news and AI
 * @param {string} symbol - Crypto symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Object>} Trade analysis with decision and reasoning
 */
export async function getTradeAnalysis(symbol) {
  try {
    // Step 1: Fetch real-time news
    console.log(`Fetching news for ${symbol}...`);
    const newsArticles = await fetchRealTimeNews(symbol);
    
    // Step 2: Format news headlines for AI prompt
    let newsContext = '';
    if (newsArticles.length > 0) {
      newsContext = '\n\nLatest News Headlines:\n';
      newsArticles.forEach((article, index) => {
        newsContext += `${index + 1}. ${article.title}\n`;
        if (article.description) {
          newsContext += `   ${article.description}\n`;
        }
      });
    } else {
      newsContext = '\n\nNote: No recent news available. Base analysis on general market knowledge.';
    }

    // Step 3: Create AI prompt with news context
    const prompt = `You are Kaseddie AI, a professional cryptocurrency trading analyst with a spooky twist 👻.

Analyze ${symbol} cryptocurrency for trading based on the following real-time news:
${newsContext}

Provide a comprehensive trading analysis in the following JSON format:
{
  "symbol": "${symbol}",
  "decision": "BUY" or "SELL" or "HOLD",
  "confidence": <number between 0-100>,
  "reasoning": "<brief explanation based on news sentiment and market analysis>",
  "targetPrice": "<estimated target price or percentage>",
  "riskLevel": "LOW" or "MEDIUM" or "HIGH",
  "newsImpact": "<how the news affects the decision>",
  "timeframe": "<recommended holding period>",
  "timestamp": "${new Date().toISOString()}"
}

Consider:
- News sentiment (positive/negative/neutral)
- Market trends indicated by the news
- Risk factors mentioned in the news
- Overall crypto market conditions

Respond ONLY with valid JSON, no additional text.`;

    // Step 4: Get AI analysis with retry logic
    console.log(`Getting AI analysis for ${symbol}...`);
    const response = await generateWithRetry(prompt);
    const text = response.candidates[0].content.parts[0].text;
    
    // Step 5: Parse AI response
    try {
      // Remove markdown code blocks if present
      let jsonText = text.trim();
      const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/) || jsonText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      // Find JSON object in the text
      const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonText = jsonObjectMatch[0];
      }
      
      const analysis = JSON.parse(jsonText);
      
      // Ensure all required fields are present
      return {
        symbol: analysis.symbol || symbol,
        decision: analysis.decision || 'HOLD',
        confidence: analysis.confidence || 50,
        reasoning: analysis.reasoning || 'Analysis based on available data',
        targetPrice: analysis.targetPrice || 'N/A',
        riskLevel: analysis.riskLevel || 'MEDIUM',
        newsImpact: analysis.newsImpact || 'Limited news data available',
        timeframe: analysis.timeframe || 'Short-term (1-7 days)',
        timestamp: new Date().toISOString(),
        newsCount: newsArticles.length
      };
    } catch (parseError) {
      console.warn('Could not parse AI response as JSON:', parseError.message);
      console.log('AI Response:', text);
      
      // Fallback: create structured response from text
      const decision = text.match(/BUY|SELL|HOLD/i)?.[0]?.toUpperCase() || 'HOLD';
      
      return {
        symbol,
        decision,
        confidence: 50,
        reasoning: text.substring(0, 300),
        targetPrice: 'N/A',
        riskLevel: 'MEDIUM',
        newsImpact: `Based on ${newsArticles.length} news articles`,
        timeframe: 'Short-term (1-7 days)',
        timestamp: new Date().toISOString(),
        newsCount: newsArticles.length,
        rawResponse: text
      };
    }
  } catch (error) {
    console.error('Trade analysis error:', error);
    throw new Error(`Failed to analyze ${symbol}: ${error.message}`);
  }
}

/**
 * Get trading knowledge from Gemini AI
 * @param {string} question - Trading question to ask the AI
 * @returns {Promise<string>} AI response text
 */
export async function getTradingKnowledge(question) {
  try {
    const prompt = `You are Kaseddie AI 👻, a spooky but knowledgeable crypto trading assistant. 

Answer this trading question with expertise and a touch of Halloween flair: ${question}

Provide a clear, informative answer that helps the user understand the concept.`;
    
    const response = await generateWithRetry(prompt);
    const text = response.candidates[0].content.parts[0].text;
    
    return text;
  } catch (error) {
    console.error('Vertex AI error:', error);
    throw new Error('Failed to get trading knowledge from AI');
  }
}

/**
 * Generate trading strategy recommendations
 * @param {Object} userProfile - User profile with balance and preferences
 * @returns {Promise<Object>} Strategy recommendations
 */
export async function generateTradingStrategy(userProfile) {
  try {
    const prompt = `You are Kaseddie AI 👻, a professional crypto trading strategist.

Create a personalized trading strategy for a user with:
- Balance: $${userProfile.balance}
- Risk Tolerance: ${userProfile.riskTolerance || 'MEDIUM'}
- Experience Level: ${userProfile.experience || 'BEGINNER'}

Provide recommendations for:
1. Portfolio Allocation (how to split the balance)
2. Top 3-5 Cryptocurrencies to consider
3. Risk Management Guidelines
4. Expected Returns (realistic estimates)
5. Entry and Exit Strategy

Format your response in clear sections with actionable advice.`;
    
    const response = await generateWithRetry(prompt);
    const text = response.candidates[0].content.parts[0].text;
    
    return {
      strategy: text,
      userProfile,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Strategy generation error:', error);
    throw new Error('Failed to generate trading strategy');
  }
}
