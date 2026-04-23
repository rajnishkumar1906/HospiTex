import axios from 'axios';
import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Communicate with MyBot Flask app (running on port 5001)
const BOT_URL = process.env.BOT_URL || 'http://localhost:5001';

export const chatWithBot = handleAsync(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return apiResponse.error(res, 'Message is required', 400);
  }

  try {
    console.log('🤖 Forwarding message to MyBot:', message);
    
    const response = await axios.post(`${BOT_URL}/chat`, {
      message: message
    }, {
      timeout: 30000 // Give the bot some time to think (RAG can be slow)
    });

    if (response.data && response.data.success) {
      return apiResponse.success(res, {
        answer: response.data.answer,
        timestamp: response.data.timestamp
      }, 'Bot responded successfully');
    } else {
      return apiResponse.error(res, 'Bot failed to provide a valid response', 500);
    }
  } catch (error) {
    console.error('❌ Bot Connection Error:', error.message);
    
    // Check if it's a connection error or a bot error
    if (error.code === 'ECONNREFUSED') {
      return apiResponse.error(res, 'MediBot service is currently offline. Please try again later.', 503);
    }
    
    return apiResponse.error(res, error.response?.data?.error || 'Failed to communicate with MediBot', error.response?.status || 500);
  }
});
