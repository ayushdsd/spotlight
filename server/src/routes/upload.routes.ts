import express from 'express';
import { uploadProfilePicture, uploadMessageAttachment } from '../controllers/upload.controller';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/profile-picture', auth, upload.single('image'), uploadProfilePicture);
router.post('/message-attachment', auth, upload.single('file'), uploadMessageAttachment);

export default router;
