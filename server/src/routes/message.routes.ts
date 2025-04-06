import express, { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} from '../controllers/message.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// All message routes require authentication
router.use(auth);

// Conversation routes
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

export default router;
