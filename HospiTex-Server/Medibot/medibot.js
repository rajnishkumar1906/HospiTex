import express from 'express';
import axios from 'axios';

const router = express.Router();

// Flask MediBot backend URL
const MEDIBOT_URL = process.env.MEDIBOT_URL || 'http://localhost:5001';

/**
 * Proxy route to create a new chat session
 */
router.get('/chat/new', async (req, res) => {
  try {
    const response = await axios.get(`${MEDIBOT_URL}/chat/new`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (chat/new):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create chat session',
      message: error.message
    });
  }
});

/**
 * Proxy route to get list of chat sessions
 */
router.get('/chat/list', async (req, res) => {
  try {
    const response = await axios.get(`${MEDIBOT_URL}/chat/list`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (chat/list):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to load chat list',
      message: error.message
    });
  }
});

/**
 * Proxy route to load a specific chat
 */
router.get('/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const response = await axios.get(`${MEDIBOT_URL}/chat/${chatId}`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (chat/:chatId):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to load chat',
      message: error.message
    });
  }
});

/**
 * Proxy route to activate a chat
 */
router.post('/chat/activate/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const response = await axios.post(`${MEDIBOT_URL}/chat/activate/${chatId}`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (chat/activate):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to activate chat',
      message: error.message
    });
  }
});

/**
 * Proxy route to delete a chat
 */
router.delete('/chat/delete/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const response = await axios.delete(`${MEDIBOT_URL}/chat/delete/${chatId}`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (chat/delete):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete chat',
      message: error.message
    });
  }
});

/**
 * Proxy route to ask MediBot a question
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, chat_id } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await axios.post(`${MEDIBOT_URL}/ask`, {
      question: question.trim(),
      chat_id: chat_id || null
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('MediBot error (ask):', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to get response from MediBot',
      message: error.message
    });
  }
});

/**
 * Health check endpoint for MediBot
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${MEDIBOT_URL}/health`);
    res.json(response.data);
  } catch (error) {
    console.error('MediBot health check error:', error.message);
    res.status(500).json({
      status: 'unhealthy',
      error: 'MediBot backend is not available',
      message: error.message
    });
  }
});

export default router;
