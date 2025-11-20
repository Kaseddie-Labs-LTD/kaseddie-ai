import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Default voice ID (Rachel - a clear, professional voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Synthesize speech from text using ElevenLabs API
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Optional voice ID (defaults to Rachel)
 * @returns {Promise<Buffer>} Audio buffer
 */
export async function synthesizeSpeech(text, voiceId = DEFAULT_VOICE_ID) {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'placeholder') {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('ElevenLabs API error:', error.response?.data || error.message);
    throw new Error('Failed to synthesize speech');
  }
}

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} List of available voices
 */
export async function getAvailableVoices() {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'placeholder') {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    return response.data.voices;
  } catch (error) {
    console.error('ElevenLabs API error:', error.response?.data || error.message);
    throw new Error('Failed to get available voices');
  }
}

/**
 * Synthesize spooky trading alert
 * @param {string} message - Trading alert message
 * @returns {Promise<Buffer>} Audio buffer
 */
export async function synthesizeTradingAlert(message) {
  const spookyMessage = `👻 Kaseddie AI Alert: ${message}`;
  return synthesizeSpeech(spookyMessage);
}

/**
 * Get user's character count and subscription info
 * @returns {Promise<Object>} User subscription info
 */
export async function getUserInfo() {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'placeholder') {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/user`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('ElevenLabs API error:', error.response?.data || error.message);
    throw new Error('Failed to get user info');
  }
}
