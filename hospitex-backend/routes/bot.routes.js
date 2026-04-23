import { Router } from 'express';
import { chatWithBot } from '../controllers/bot.controller.js';
import userAuth from '../middleware/auth.middleware.js';

const router = Router();

// Chatbot endpoint (protected, requires user to be logged in)
router.post('/chat', userAuth, chatWithBot);

export default router;
