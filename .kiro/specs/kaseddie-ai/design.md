# Design Document

## Overview

Kaseddie AI is a full-stack autonomous crypto trading agent featuring a React frontend with Tailwind CSS and a Node.js Express backend. The application provides real-time cryptocurrency market monitoring, agent control, and trade history visualization with a spooky Halloween-themed dark mode design.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  ┌───────────────────────────────────┐  │
│  │         App Component             │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │    CryptoPulse Component    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   SummonAgent Component     │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  TradeGraveyard Component   │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────┐
│      Backend (Node.js + Express)        │
│  ┌───────────────────────────────────┐  │
│  │         Express Server            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   /api/crypto-pulse (GET)   │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │    /api/trades (GET)        │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  /api/agent/summon (POST)   │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.2.0 - UI component library
- Vite 5.0.8 - Build tool and dev server
- Tailwind CSS 3.3.6 - Utility-first CSS framework
- Native Fetch API - HTTP client

**Backend:**
- Node.js - JavaScript runtime
- Express 4.18.2 - Web framework
- CORS 2.8.5 - Cross-origin resource sharing middleware

## Components and Interfaces

### Frontend Components

#### App Component
Main application container that orchestrates all child components.

**Props:** None

**State:** None (stateless container)

**Responsibilities:**
- Render page layout structure
- Mount CryptoPulse, SummonAgent, and TradeGraveyard components
- Apply global styling and theme

#### CryptoPulse Component
Displays real-time cryptocurrency prices in an animated ticker.

**Props:** None

**State:**
```javascript
{
  cryptoData: Array<{
    symbol: string,
    price: number,
    change: number
  }>
}
```

**Lifecycle:**
- `useEffect` on mount: Fetch crypto data from `/api/crypto-pulse`
- Update state with fetched data

**Rendering:**
- Horizontal scrolling marquee animation
- Display symbol, price, and percentage change
- Color-code changes (green for positive, red for negative)

#### SummonAgent Component
Controls the trading agent activation state.

**Props:** None

**State:**
```javascript
{
  isActive: boolean,
  message: string
}
```

**Event Handlers:**
- `handleSummon`: Toggle agent state and POST to `/api/agent/summon`

**Rendering:**
- Large button with dynamic styling based on `isActive`
- Temporary message display on state change
- Glow animation when active

#### TradeGraveyard Component
Displays historical trade records.

**Props:** None

**State:**
```javascript
{
  trades: Array<{
    id: number,
    symbol: string,
    type: 'BUY' | 'SELL',
    amount: number,
    price: number,
    profit: number,
    timestamp: string
  }>
}
```

**Lifecycle:**
- `useEffect` on mount: Fetch trades from `/api/trades`
- Update state with fetched data

**Rendering:**
- List of trade cards with glassmorphism styling
- Display trade details and profit/loss
- Color-code profit (green for positive, red for negative)

### Backend API Endpoints

#### GET /api/crypto-pulse
Returns current cryptocurrency market data.

**Response:**
```json
[
  {
    "symbol": "BTC",
    "price": 43250.50,
    "change": 2.5
  }
]
```

**Status Codes:**
- 200: Success

#### GET /api/trades
Returns historical trade records.

**Response:**
```json
[
  {
    "id": 1,
    "symbol": "BTC",
    "type": "BUY",
    "amount": 0.05,
    "price": 42800,
    "profit": 125.50,
    "timestamp": "2025-10-31T23:45:00Z"
  }
]
```

**Status Codes:**
- 200: Success

#### POST /api/agent/summon
Activates or deactivates the trading agent.

**Request Body:** None required

**Response:**
```json
{
  "status": "summoned",
  "message": "👻 Agent awakened from the crypto crypt...",
  "timestamp": "2025-11-13T10:30:00Z"
}
```

**Status Codes:**
- 200: Success

## Data Models

### CryptoData
```typescript
interface CryptoData {
  symbol: string;        // Cryptocurrency ticker symbol (e.g., "BTC")
  price: number;         // Current price in USD
  change: number;        // Percentage change (positive or negative)
}
```

### Trade
```typescript
interface Trade {
  id: number;            // Unique trade identifier
  symbol: string;        // Cryptocurrency ticker symbol
  type: 'BUY' | 'SELL'; // Trade direction
  amount: number;        // Quantity traded
  price: number;         // Execution price in USD
  profit: number;        // Profit/loss in USD (negative for loss)
  timestamp: string;     // ISO 8601 timestamp
}
```

### AgentResponse
```typescript
interface AgentResponse {
  status: string;        // Agent status ("summoned", "dismissed")
  message: string;       // User-facing message
  timestamp: string;     // ISO 8601 timestamp
}
```

## Self-Awareness System Context

### System Context Constant

The AI service maintains a constant string containing comprehensive information about Kaseddie AI's architecture and capabilities. This context is prepended to all knowledge queries to ensure the AI can accurately answer questions about itself.

**SYSTEM_CONTEXT Structure:**
```javascript
const SYSTEM_CONTEXT = `You are Kaseddie AI, an autonomous trading agent built for the Kiroween Hackathon.

Your Architecture (The Frankenstein Stack):
- Brain: Google Vertex AI (Gemini 1.5 Flash) for logic and market analysis
- Voice: Google Cloud Text-to-Speech (Journey Voice) for speaking results
- Eyes: Binance API for real-time crypto prices
- Nervous System: WorkOS for secure authentication and KYC identity verification
- Body: Hosted on Render (Backend) and Netlify (Frontend)
- Wallet: Stripe integration for deposits/withdrawals

Your Capabilities:
- You execute trades using 8 algorithmic strategies (Momentum, Mean Reversion, etc.)
- You automatically calculate Stop Loss (-2%) and Take Profit (+4%) for every trade
- You require KYC verification before unlocking the trading engine
`;
```

### getTradingKnowledge Enhancement

The `getTradingKnowledge` function is modified to include system context in every AI prompt:

**Before:**
```javascript
const prompt = `You are Kaseddie AI 👻, a spooky but knowledgeable crypto trading assistant. 

Answer this trading question with expertise and a touch of Halloween flair: ${question}`;
```

**After:**
```javascript
const prompt = `${SYSTEM_CONTEXT}

Answer this trading question with expertise and a touch of Halloween flair: ${question}`;
```

This ensures that when users ask questions like "How were you built?" or "What strategies do you use?", the AI has the necessary context to provide accurate, detailed responses about the Kaseddie AI system.

## Error Handling

### Frontend Error Handling

**Network Errors:**
- Use try-catch blocks around fetch calls
- Log errors to console
- Display graceful fallback UI (empty states)
- Do not crash the application

**Example:**
```javascript
try {
  const res = await fetch('http://localhost:3000/api/trades');
  const data = await res.json();
  setTrades(data);
} catch (err) {
  console.error('Failed to fetch trades:', err);
  // Component continues to render with empty state
}
```

### Backend Error Handling

**Invalid Routes:**
- Express default 404 handler
- Return JSON error response

**Server Errors:**
- Log errors to console
- Return 500 status with generic error message

## Testing Strategy

### Frontend Testing

**Component Testing:**
- Verify CryptoPulse renders crypto data correctly
- Verify SummonAgent toggles state on click
- Verify TradeGraveyard displays trade list
- Verify color coding for positive/negative values

**Integration Testing:**
- Verify API calls are made on component mount
- Verify state updates after successful API responses
- Verify error handling when API calls fail

### Backend Testing

**Endpoint Testing:**
- Verify GET /api/crypto-pulse returns array of crypto data
- Verify GET /api/trades returns array of trades
- Verify POST /api/agent/summon returns success response
- Verify CORS headers are present in responses

**Manual Testing:**
- Start backend server and verify it listens on port 3000
- Use curl or Postman to test each endpoint
- Verify response format matches specification

## Design Decisions

### Spooky Theme Implementation

**Rationale:** The Kiroween hackathon requires a Halloween-themed costume contest entry.

**Implementation:**
- Tailwind config extends theme with custom neon colors
- Custom keyframe animations for glow and float effects
- Glassmorphism using `backdrop-blur-lg` and transparent backgrounds
- Halloween emoji icons (🎃, 👻, 💀) throughout UI

### Mock Data Approach

**Rationale:** Enables rapid frontend development without external API dependencies.

**Implementation:**
- Backend returns hardcoded mock data
- Data structure matches expected real API format
- Allows frontend to be fully functional for demo purposes

### Component State Management

**Rationale:** Simple application with minimal shared state.

**Implementation:**
- Use React useState for local component state
- Use useEffect for data fetching on mount
- No global state management library needed (Redux, Context)

### Monorepo Structure

**Rationale:** Separate frontend and backend for independent development and deployment.

**Implementation:**
- Two separate package.json files
- Frontend runs on port 5173, backend on port 3000
- CORS enabled for local development
- Can be deployed separately to different hosting services
