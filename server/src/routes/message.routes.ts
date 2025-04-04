import express from 'express';
import { sendMessage, getMessages, markAsRead, getContacts } from '../controllers/message.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/contacts', auth, getContacts);
router.post('/', auth, sendMessage);
router.get('/:userId', auth, getMessages);
router.patch('/:messageId/read', auth, markAsRead);

export default router;
