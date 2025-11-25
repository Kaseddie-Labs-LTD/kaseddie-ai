# Implementation Plan

- [ ] 1. Add self-awareness system context to AI service
  - Create SYSTEM_CONTEXT constant at the top of backend/src/services/aiService.js
  - Include comprehensive information about Kaseddie AI's architecture (Vertex AI, Text-to-Speech, Binance API, WorkOS, Stripe, Render, Netlify)
  - Include information about trading capabilities (8 algorithmic strategies, automatic stop loss/take profit)
  - Include information about security features (KYC verification requirement)
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 2. Update getTradingKnowledge function to use system context
  - Modify the prompt construction in getTradingKnowledge function
  - Prepend SYSTEM_CONTEXT to the user's question in the AI prompt
  - Ensure the context is included before the user question for proper AI understanding
  - _Requirements: 7.4, 7.5_

- [ ] 3. Test self-awareness functionality
  - Test with question "How were you built?" to verify architecture information is returned
  - Test with question "What strategies do you use?" to verify trading strategy information is returned
  - Test with question "What security features do you have?" to verify KYC information is returned
  - Verify that general trading questions still work correctly with the added context
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
