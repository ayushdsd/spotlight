import { Router, Request, Response } from 'express';
import Post from '../models/post.model';
import auth from '../middleware/auth';
import upload from '../middleware/multer';
import { cloudinaryUpload } from '../utils/cloudinary';

// Use real auth middleware
function authenticate(req: Request, res: Response, next: Function) {
  // In production, set req.user using your real authentication
  req.user = req.user || {
    id: 'demoUser',
    name: 'Demo User',
    picture: '',
    role: 'artist',
  };
  next();
}

const router = Router();

router.use(auth);

// POST /api/feed - Create a post in MongoDB (with optional image)
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const user = req.user;
    let imageUrl = '';
    if (req.file) {
      // Upload image to cloudinary
      const result = await cloudinaryUpload(req.file, { folder: `feed` });
      imageUrl = result.secure_url;
    }
    if (!content && !imageUrl) {
      return res.status(400).json({ error: 'Post must have text or an image' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Missing user' });
    }
    const post = new Post({
      author: user._id,
      content,
      imageUrl: imageUrl || undefined,
    });
    await post.save();
    await post.populate('author', 'name picture role');
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Could not create post' });
  }
});

// GET /api/feed - Get paginated feed from MongoDB
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name picture role');
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch feed' });
  }
});

export default router;
