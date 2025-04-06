import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} from '../controllers/message.controller';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Conversation routes
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

export default router;
