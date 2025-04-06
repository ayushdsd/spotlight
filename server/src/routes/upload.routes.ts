import express from 'express';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  uploadFile,
  uploadProfilePicture,
  uploadMessageAttachment,
  uploadPortfolioImages,
} from '../controllers/upload.controller';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow only images for profile picture and portfolio
  if (file.fieldname === 'image' || file.fieldname === 'images') {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed!'));
      return;
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// All upload routes require authentication
router.use(authMiddleware);

// File upload routes
router.post('/file', upload.single('file'), uploadFile);
router.post('/profile-picture', upload.single('image'), uploadProfilePicture);
router.post('/message-attachment', upload.single('file'), uploadMessageAttachment);
router.post('/portfolio-images', upload.array('images', 10), uploadPortfolioImages);

export default router;
