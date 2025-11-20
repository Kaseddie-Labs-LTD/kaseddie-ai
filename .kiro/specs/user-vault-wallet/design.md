# Design Document

## Overview

The User Vault & Wallet system is a comprehensive backend service that integrates authentication (WorkOS), payment processing (Stripe), voice interaction (ElevenLabs), generative AI (Vultr), and an advanced multi-strategy trading engine. The system provides secure user management, wallet operations, hands-free voice trading, educational AI assistance, and automated trading signal generation.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │UserVault │  │  Voice   │  │ Trading  │  │Dashboard │  │
│  │Component │  │Interface │  │ Signals  │  │   News   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes Layer                        │  │
│  │  /auth  /wallet  /voice  /ai  /trading              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Service Layer                             │  │
│  │  AuthService  WalletService  VoiceService           │  │
│  │  AIService    TradingEngineService                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Integration Layer                            │  │
│  │  WorkOS  Stripe  ElevenLabs  Vultr                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Data Access Layer                            │  │
│  │  UserRepository  TradeRepository                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  database.json   │
                  │  (Local Storage) │
                  └──────────────────┘
```

### External Service Dependencies

1. **WorkOS** - Authentication and user management
2. **Stripe** - Payment processing for deposits and withdrawals
3. **ElevenLabs** - Text-to-speech synthesis for voice output
4. **Vultr Inference API** - Generative AI for question answering
5. **Financial News API** - Real-time market news (e.g., NewsAPI, Alpha Vantage)

## Components and Interfaces

### Backend Components

#### 1. Authentication Service (`AuthService`)

**Responsibilities:**
- Handle WorkOS authentication flow
- Manage user sessions and tokens
- Create new user records on first login
- Validate authentication tokens

**Key Methods:**
```javascript
async signUp(email, password)
async login(email, password)
async validateToken(token)
async getWorkOSAuthUrl()
async handleWorkOSCallback(code)
```

**WorkOS Integration Pattern:**
```javascript
// Initialize WorkOS client
const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Generate auth URL for frontend
const authUrl = workos.sso.getAuthorizationURL({
  clientID: process.env.WORKOS_CLIENT_ID,
  redirectURI: process.env.WORKOS_REDIRECT_URI,
  provider: 'authkit'
});

// Handle callback and create session
const profile = await workos.sso.getProfileAndToken({
  code: authCode
});
```

#### 2. Wallet Service (`WalletService`)

**Responsibilities:**
- Process deposit requests via Stripe
- Process withdrawal requests via Stripe
- Update wallet balances
- Validate sufficient funds

**Key Methods:**
```javascript
async createDepositIntent(userId, amount)
async processDeposit(userId, stripePaymentIntentId)
async createWithdrawal(userId, amount)
async getBalance(userId)
```

**Stripe Integration Pattern:**
```javascript
// Create payment intent for deposit
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100, // Convert to cents
  currency: 'usd',
  metadata: { userId }
});

// Process payout for withdrawal
const payout = await stripe.payouts.create({
  amount: amount * 100,
  currency: 'usd',
  metadata: { userId }
});
```

#### 3. Voice Service (`VoiceService`)

**Responsibilities:**
- Transcribe audio to text
- Synthesize text to speech using ElevenLabs
- Manage voice interaction sessions

**Key Methods:**
```javascript
async transcribeAudio(audioBuffer)
async synthesizeSpeech(text, voiceId)
```

**ElevenLabs Integration Pattern:**
```javascript
// Synthesize speech
const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: 'POST',
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: text,
    model_id: 'eleven_monolingual_v1'
  })
});
```

#### 4. AI Service (`AIService`)

**Responsibilities:**
- Process user questions about trading
- Generate educational responses using Vultr
- Fetch and format financial news

**Key Methods:**
```javascript
async answerQuestion(question, context)
async getFinancialNews()
```

**Vultr Integration Pattern:**
```javascript
// Generate AI response
const response = await fetch('https://api.vultrinference.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama2-13b-chat',
    messages: [
      { role: 'system', content: 'You are a crypto trading expert.' },
      { role: 'user', content: question }
    ]
  })
});
```

#### 5. Trading Engine Service (`TradingEngineService`)

**Responsibilities:**
- Implement 8 trading strategies
- Analyze market data
- Generate buy/sell/take-profit signals
- Enforce KYC requirements before trading

**Key Methods:**
```javascript
async selectStrategy(userId, strategyName)
async generateSignals(userId, marketData)
async executeStrategy(strategyName, marketData)
```

**Trading Strategies:**
1. **Momentum** - Buy when price shows strong upward trend
2. **Mean Reversion** - Buy when price drops below moving average
3. **Breakout** - Buy when price breaks resistance levels
4. **RSI Oversold** - Buy when RSI < 30
5. **MACD Crossover** - Buy on bullish MACD crossover
6. **Bollinger Bands** - Buy when price touches lower band
7. **Volume Spike** - Buy on unusual volume increase
8. **Sentiment Analysis** - Buy based on positive news sentiment

#### 6. KYC Service (`KYCService`)

**Responsibilities:**
- Manage KYC verification status
- Validate user identity
- Enforce trading restrictions

**Key Methods:**
```javascript
async verifyUser(userId)
async getKYCStatus(userId)
async canTrade(userId)
```

### Data Access Layer

#### User Repository (`UserRepository`)

**Responsibilities:**
- CRUD operations for user data
- Load/save from database.json
- Handle concurrent access

**Key Methods:**
```javascript
async create(userData)
async findById(userId)
async findByEmail(email)
async update(userId, updates)
async updateWalletBalance(userId, newBalance)
async updateKYCStatus(userId, status)
```

#### Trade Repository (`TradeRepository`)

**Responsibilities:**
- Store trade history
- Track active signals
- Query past performance

**Key Methods:**
```javascript
async createTrade(tradeData)
async getTradeHistory(userId)
async getActiveSignals(userId)
```

## Data Models

### User Model

```javascript
{
  id: string,              // UUID
  email: string,           // From WorkOS
  workosUserId: string,    // WorkOS user identifier
  kycStatus: 'pending' | 'verified' | 'rejected',
  walletBalance: number,   // USD amount
  activeStrategy: string | null,  // Current trading strategy
  stripeCustomerId: string | null,
  createdAt: string,       // ISO timestamp
  updatedAt: string        // ISO timestamp
}
```

### Trade Model

```javascript
{
  id: string,              // UUID
  userId: string,          // Reference to User
  symbol: string,          // e.g., 'BTC', 'ETH'
  type: 'BUY' | 'SELL' | 'TAKE_PROFIT',
  amount: number,          // Quantity
  price: number,           // USD price
  strategy: string,        // Strategy that generated signal
  profit: number | null,   // Realized profit/loss
  status: 'pending' | 'executed' | 'cancelled',
  timestamp: string        // ISO timestamp
}
```

### Trading Signal Model

```javascript
{
  id: string,
  userId: string,
  symbol: string,
  type: 'BUY' | 'SELL' | 'TAKE_PROFIT',
  recommendedPrice: number,
  confidence: number,      // 0-100
  strategy: string,
  reasoning: string,       // Why this signal was generated
  expiresAt: string,       // ISO timestamp
  createdAt: string
}
```

### Voice Session Model

```javascript
{
  id: string,
  userId: string,
  transcript: string,      // User's spoken input
  response: string,        // AI's text response
  audioUrl: string | null, // URL to synthesized audio
  createdAt: string
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /api/auth/workos/url          - Get WorkOS auth URL
POST   /api/auth/workos/callback     - Handle WorkOS callback
GET    /api/auth/profile             - Get current user profile
POST   /api/auth/logout              - Logout user
```

### Wallet Routes (`/api/wallet`)

```
POST   /api/wallet/deposit           - Create Stripe payment intent
POST   /api/wallet/deposit/confirm   - Confirm deposit after Stripe payment
POST   /api/wallet/withdraw          - Initiate withdrawal
GET    /api/wallet/balance           - Get current balance
GET    /api/wallet/transactions      - Get transaction history
```

### KYC Routes (`/api/kyc`)

```
POST   /api/kyc/verify               - Submit KYC verification
GET    /api/kyc/status               - Get KYC status
```

### Voice Routes (`/api/voice`)

```
POST   /api/voice/transcribe         - Transcribe audio to text
POST   /api/voice/synthesize         - Synthesize text to speech
```

### AI Routes (`/api/ai`)

```
POST   /api/ai/ask                   - Ask trading question
GET    /api/ai/news                  - Get financial news
```

### Trading Routes (`/api/trading`)

```
POST   /api/trading/strategy         - Select trading strategy
GET    /api/trading/signals          - Get active signals
POST   /api/trading/execute          - Execute a signal
GET    /api/trading/history          - Get trade history
GET    /api/trading/strategies       - List available strategies
```

## Error Handling

### Error Response Format

```javascript
{
  error: {
    code: string,        // e.g., 'KYC_REQUIRED', 'INSUFFICIENT_FUNDS'
    message: string,     // Human-readable error
    details: object      // Additional context
  }
}
```

### Common Error Codes

- `AUTH_REQUIRED` - User not authenticated
- `KYC_REQUIRED` - KYC verification needed
- `INSUFFICIENT_FUNDS` - Not enough balance
- `INVALID_STRATEGY` - Strategy not found
- `WORKOS_ERROR` - WorkOS integration failure
- `STRIPE_ERROR` - Stripe payment failure
- `ELEVENLABS_ERROR` - Voice synthesis failure
- `VULTR_ERROR` - AI service failure

### Error Handling Strategy

1. **Service Layer** - Catch integration errors and wrap in custom error types
2. **Route Layer** - Transform errors to HTTP responses
3. **Frontend** - Display user-friendly error messages
4. **Logging** - Log all errors with context for debugging

## Testing Strategy

### Unit Tests

- Test each service method in isolation
- Mock external API calls (WorkOS, Stripe, ElevenLabs, Vultr)
- Test data validation and business logic
- Test error handling paths

### Integration Tests

- Test API endpoints end-to-end
- Use test database (separate JSON file)
- Test WorkOS authentication flow with test credentials
- Test Stripe with test mode API keys
- Verify data persistence

### Manual Testing

- Test voice recording and playback
- Verify Stripe payment flow in test mode
- Test trading signal generation with live market data
- Verify KYC enforcement

## Security Considerations

1. **Authentication**
   - Use WorkOS for secure authentication
   - Store session tokens securely (httpOnly cookies)
   - Implement token expiration and refresh

2. **API Keys**
   - Store all API keys in environment variables
   - Never commit keys to version control
   - Use different keys for development and production

3. **Payment Security**
   - Use Stripe's secure payment flow
   - Never store credit card information
   - Validate all amounts server-side

4. **Data Protection**
   - Encrypt sensitive data in database.json
   - Implement rate limiting on API endpoints
   - Validate all user inputs

5. **KYC Enforcement**
   - Always check KYC status before trading operations
   - Log all trading attempts for audit trail

## Performance Considerations

1. **Caching**
   - Cache financial news for 5 minutes
   - Cache trading signals for 1 minute
   - Cache user profiles in memory

2. **Rate Limiting**
   - Limit voice transcription to 10 requests/minute
   - Limit AI questions to 20 requests/minute
   - Limit trading signals to 5 requests/minute

3. **Async Operations**
   - Process Stripe webhooks asynchronously
   - Generate trading signals in background
   - Fetch news data in parallel

## Deployment Considerations

1. **Environment Variables**
   ```
   WORKOS_API_KEY
   WORKOS_CLIENT_ID
   WORKOS_REDIRECT_URI
   STRIPE_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY
   ELEVENLABS_API_KEY
   VULTR_API_KEY
   NEWS_API_KEY
   DATABASE_PATH
   PORT
   ```

2. **Database Backup**
   - Implement periodic backups of database.json
   - Store backups in secure location

3. **Monitoring**
   - Log all API requests and responses
   - Monitor external service health
   - Track error rates and response times
