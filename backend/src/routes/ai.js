import express from 'express';
import { getTradingKnowledge, getTradeAnalysis, generateTradingStrategy } from '../services/aiService.js';
import { synthesizeSpeech, synthesizeTradingAlert, getAvailableVoices, getUserInfo } from '../services/voiceService.js';

const router = express.Router();

// AI Knowledge Endpoints

/**
 * POST /api/ai/ask - Ask trading question to AI
 */
router.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Question is required'
      }
    });
  }

  try {
    const answer = await getTradingKnowledge(question);
    res.json({
      question,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI ask error:', error);
    res.status(500).json({
      error: {
        code: 'AI_ERROR',
        message: 'Failed to get AI response',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/ai/analyze - Get trade analysis for a symbol
 */
router.post('/analyze', async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Symbol is required'
      }
    });
  }

  try {
    const analysis = await getTradeAnalysis(symbol);
    res.json(analysis);
  } catch (error) {
    console.error('Trade analysis error:', error);
    res.status(500).json({
      error: {
        code: 'AI_ERROR',
        message: 'Failed to analyze trade',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/ai/strategy - Generate trading strategy
 */
router.post('/strategy', async (req, res) => {
  const { balance, riskTolerance, experience } = req.body;

  try {
    const strategy = await generateTradingStrategy({
      balance: balance || 0,
      riskTolerance: riskTolerance || 'MEDIUM',
      experience: experience || 'BEGINNER'
    });
    res.json(strategy);
  } catch (error) {
    console.error('Strategy generation error:', error);
    res.status(500).json({
      error: {
        code: 'AI_ERROR',
        message: 'Failed to generate strategy',
        details: error.message
      }
    });
  }
});

// Voice Synthesis Endpoints

/**
 * POST /api/ai/speak - Synthesize speech from text
 */
router.post('/speak', async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Text is required'
      }
    });
  }

  try {
    const audioBuffer = await synthesizeSpeech(text, voiceId);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('Speech synthesis error:', error);
    res.status(500).json({
      error: {
        code: 'VOICE_ERROR',
        message: 'Failed to synthesize speech',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/ai/alert - Synthesize trading alert
 */
router.post('/alert', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Message is required'
      }
    });
  }

  try {
    const audioBuffer = await synthesizeTradingAlert(message);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('Alert synthesis error:', error);
    res.status(500).json({
      error: {
        code: 'VOICE_ERROR',
        message: 'Failed to synthesize alert',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/ai/voices - Get available voices
 */
router.get('/voices', async (req, res) => {
  try {
    const voices = await getAvailableVoices();
    res.json({ voices });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({
      error: {
        code: 'VOICE_ERROR',
        message: 'Failed to get available voices',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/ai/voice-info - Get ElevenLabs user info
 */
router.get('/voice-info', async (req, res) => {
  try {
    const userInfo = await getUserInfo();
    res.json(userInfo);
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      error: {
        code: 'VOICE_ERROR',
        message: 'Failed to get user info',
        details: error.message
      }
    });
  }
});

export default router;
