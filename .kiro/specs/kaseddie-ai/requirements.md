# Requirements Document

## Introduction

Kaseddie AI is an autonomous crypto trading agent built for the Kiroween hackathon. The system integrates real-time market data with AI sentiment analysis to execute automated cryptocurrency trades. The application features a full-stack architecture with a React frontend and Node.js backend, designed with a spooky dark theme incorporating glassmorphism effects and neon accents.

## Glossary

- **Trading Agent**: The autonomous system component that executes cryptocurrency buy and sell operations
- **Crypto Pulse**: A real-time ticker display showing current cryptocurrency prices and percentage changes
- **Dashboard**: The main user interface displaying market data, agent controls, and trade history
- **Trade Graveyard**: A historical log displaying past trade executions and their performance metrics
- **Summon Action**: The user-initiated command to activate or deactivate the Trading Agent
- **Frontend Application**: The React-based user interface built with Vite and Tailwind CSS
- **Backend API**: The Node.js Express server providing data endpoints and agent control
- **Glassmorphism**: A UI design pattern using backdrop blur and transparency effects

## Requirements

### Requirement 1

**User Story:** As a crypto trader, I want to view real-time cryptocurrency prices in a ticker format, so that I can monitor market movements at a glance

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Frontend Application SHALL fetch current cryptocurrency data from the Backend API
2. THE Crypto Pulse SHALL display at least five cryptocurrency symbols with their current prices and percentage changes
3. THE Crypto Pulse SHALL animate continuously in a horizontal scrolling marquee pattern
4. WHEN a cryptocurrency price increases, THE Crypto Pulse SHALL display the percentage change in neon green color
5. WHEN a cryptocurrency price decreases, THE Crypto Pulse SHALL display the percentage change in red color

### Requirement 2

**User Story:** As a crypto trader, I want to start and stop the trading agent with a single button, so that I can control when automated trading occurs

#### Acceptance Criteria

1. THE Dashboard SHALL display a central button labeled "Summon Agent" in its default state
2. WHEN the user clicks the Summon Action button, THE Frontend Application SHALL send a POST request to the Backend API agent endpoint
3. WHEN the Trading Agent activates, THE Summon Action button SHALL change its label to "Agent Active" and display a neon green glow effect
4. WHEN the Trading Agent activates, THE Frontend Application SHALL display a confirmation message for three seconds
5. WHEN the user clicks the active Summon Action button, THE Trading Agent SHALL deactivate and return to its default state

### Requirement 3

**User Story:** As a crypto trader, I want to review my past trades and their performance, so that I can evaluate the agent's trading effectiveness

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Frontend Application SHALL fetch trade history data from the Backend API
2. THE Trade Graveyard SHALL display each trade with its cryptocurrency symbol, trade type, amount, and execution price
3. THE Trade Graveyard SHALL display profit or loss for each trade in neon green for positive values and red for negative values
4. THE Trade Graveyard SHALL display a timestamp for each trade execution
5. THE Trade Graveyard SHALL use glassmorphism styling with backdrop blur and transparent backgrounds

### Requirement 4

**User Story:** As a hackathon participant, I want the application to feature a spooky dark theme, so that it aligns with the Kiroween costume contest requirements

#### Acceptance Criteria

1. THE Frontend Application SHALL use a slate-900 background color as the primary background
2. THE Frontend Application SHALL use neon green (#39FF14) and neon purple (#BC13FE) as accent colors
3. THE Frontend Application SHALL apply glassmorphism effects using backdrop blur and semi-transparent backgrounds
4. THE Frontend Application SHALL include glow animations on interactive elements
5. THE Frontend Application SHALL display Halloween-themed emoji icons throughout the interface

### Requirement 5

**User Story:** As a developer, I want the backend to provide mock API endpoints, so that the frontend can function independently during development

#### Acceptance Criteria

1. THE Backend API SHALL expose a GET endpoint at /api/crypto-pulse returning cryptocurrency market data
2. THE Backend API SHALL expose a GET endpoint at /api/trades returning historical trade records
3. THE Backend API SHALL expose a POST endpoint at /api/agent/summon for agent activation
4. THE Backend API SHALL enable CORS to allow cross-origin requests from the Frontend Application
5. WHEN the Backend API receives a request, THE Backend API SHALL respond within 500 milliseconds

### Requirement 6

**User Story:** As a developer, I want the project to have a clear structure separating frontend and backend, so that I can develop and deploy each independently

#### Acceptance Criteria

1. THE Frontend Application SHALL reside in a dedicated "frontend" directory with its own package.json
2. THE Backend API SHALL reside in a dedicated "backend" directory with its own package.json
3. THE Frontend Application SHALL run on port 5173 using Vite development server
4. THE Backend API SHALL run on port 3000 using Express server
5. THE Frontend Application SHALL make HTTP requests to http://localhost:3000 for API communication

### Requirement 7

**User Story:** As a user, I want the Knowledge Terminal to provide information about Kaseddie AI itself, so that I can understand the system's architecture, capabilities, and trading strategies

#### Acceptance Criteria

1. WHEN the Trading Agent processes a knowledge query about system architecture, THE Trading Agent SHALL include context about its technology stack including Google Vertex AI, Google Cloud Text-to-Speech, Binance API, WorkOS, Stripe, Render, and Netlify
2. WHEN the Trading Agent processes a knowledge query about trading capabilities, THE Trading Agent SHALL include context about its eight algorithmic strategies and automatic stop loss and take profit calculations
3. WHEN the Trading Agent processes a knowledge query about security features, THE Trading Agent SHALL include context about KYC verification requirements before trading engine access
4. WHEN the Trading Agent receives any user question, THE Trading Agent SHALL prepend system context to the AI prompt before generating a response
5. THE Trading Agent SHALL maintain consistent self-awareness across all knowledge queries regardless of question topic
