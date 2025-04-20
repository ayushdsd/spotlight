import express, { Request, Response } from 'express';
import Post from '../models/post.model';
import auth from '../middleware/auth';
import upload from '../middleware/multer';
import { cloudinaryUpload } from '../utils/cloudinary';

const router = express.Router();

router.use(auth);

// POST /api/feed - Create a post in MongoDB (with optional image)
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    console.log('[FEED] Incoming POST /api/feed');
    console.log('[FEED] req.body:', req.body);
    console.log('[FEED] req.file:', req.file);
    const { content } = req.body;
    const user = req.user;
    let imageUrl = '';
    let postContent = content;
    if (req.file) {
      try {
        const result = await cloudinaryUpload(req.file, { folder: `feed` });
        console.log('[FEED] Cloudinary upload result:', result);
        imageUrl = result.secure_url;
      } catch (cloudErr) {
        console.error('[FEED] Cloudinary upload error:', cloudErr);
        return res.status(500).json({ error: 'Cloudinary upload failed', details: cloudErr });
      }
    }
    if (!postContent && imageUrl) {
      postContent = ' ';
    }
    if (!postContent && !imageUrl) {
      console.warn('[FEED] Post must have text or an image');
      return res.status(400).json({ error: 'Post must have text or an image' });
    }
    if (!user) {
      console.error('[FEED] Missing user');
      return res.status(400).json({ error: 'Missing user' });
    }
    console.log('[FEED] Creating post with:', { author: user._id, content: postContent, imageUrl });
    const post = new Post({
      author: user._id,
      content: postContent,
      imageUrl: imageUrl || undefined,
    });
    await post.save();
    await post.populate('author', 'name picture role');
    console.log('[FEED] Post created:', post);
    res.json({ post });
  } catch (err) {
    console.error('[FEED] Error in POST /api/feed:', err);
    res.status(500).json({ error: 'Could not create post', details: err });
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

// DELETE /api/feed/:postId - Delete a post and its image from Cloudinary
router.delete('/:postId', async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    if (!user) {
      return res.status(401).json({ error: 'Missing user' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    // Delete image from Cloudinary if exists
    if (post.imageUrl) {
      try {
        const { cloudinaryDelete } = await import('../utils/cloudinary');
        await cloudinaryDelete(post.imageUrl);
      } catch (err) {
        // Log error but allow post deletion to continue
        console.error('Cloudinary delete error:', err);
      }
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete post' });
  }
});

export default router;
