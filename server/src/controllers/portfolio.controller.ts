import { Request, Response } from 'express';
import PortfolioItem, { IPortfolioItem } from '../models/portfolio.model';
import { cloudinaryUpload, cloudinaryDelete } from '../utils/cloudinary';

// Get all portfolio items for a user
export const getUserPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { category, featured, visibility } = req.query;

    const query: any = { userId };

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (visibility) query.visibility = visibility;

    const portfolioItems = await PortfolioItem.find(query)
      .sort({ order: 1, createdAt: -1 })
      .exec();

    res.json(portfolioItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolio items' });
  }
};

// Get a single portfolio item
export const getPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = await PortfolioItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Increment view count
    item.stats.views += 1;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolio item' });
  }
};

// Create a new portfolio item
export const createPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { title, description, category, type, mediaFile, tags, credits, visibility } = req.body;
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    // Upload media to Cloudinary
    const mediaResult = await cloudinaryUpload(mediaFile, {
      folder: `portfolio/${userId}`,
      resource_type: type,
    });

    // Generate thumbnail for video/audio
    let thumbnailUrl;
    if (type === 'video') {
      thumbnailUrl = mediaResult.secure_url.replace(/\.[^/.]+$/, '.jpg');
    }

    const newItem = await PortfolioItem.create({
      userId,
      title,
      description,
      category,
      type,
      mediaUrl: mediaResult.secure_url,
      thumbnailUrl,
      tags,
      credits,
      visibility,
      metadata: {
        fileSize: mediaResult.bytes,
        fileType: mediaResult.format,
        ...(mediaResult.duration && { duration: mediaResult.duration }),
        ...(mediaResult.width && {
          dimensions: {
            width: mediaResult.width,
            height: mediaResult.height,
          },
        }),
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error creating portfolio item' });
  }
};

// Update a portfolio item
export const updatePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    const item = await PortfolioItem.findOne({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Handle media update if new file is provided
    if (updates.mediaFile) {
      // Delete old media from Cloudinary
      await cloudinaryDelete(item.mediaUrl);

      // Upload new media
      const mediaResult = await cloudinaryUpload(updates.mediaFile, {
        folder: `portfolio/${userId}`,
        resource_type: updates.type || item.type,
      });

      updates.mediaUrl = mediaResult.secure_url;
      updates.metadata = {
        fileSize: mediaResult.bytes,
        fileType: mediaResult.format,
        ...(mediaResult.duration && { duration: mediaResult.duration }),
        ...(mediaResult.width && {
          dimensions: {
            width: mediaResult.width,
            height: mediaResult.height,
          },
        }),
      };

      // Update thumbnail for video
      if (updates.type === 'video' || item.type === 'video') {
        updates.thumbnailUrl = mediaResult.secure_url.replace(/\.[^/.]+$/, '.jpg');
      }
    }

    // Update the item
    const updatedItem = await PortfolioItem.findByIdAndUpdate(
      itemId,
      { $set: updates },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error updating portfolio item' });
  }
};

// Delete a portfolio item
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    const item = await PortfolioItem.findOne({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Delete media from Cloudinary
    await cloudinaryDelete(item.mediaUrl);
    if (item.thumbnailUrl) {
      await cloudinaryDelete(item.thumbnailUrl);
    }

    // Delete the item
    await item.deleteOne();

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting portfolio item' });
  }
};

// Update portfolio items order
export const updatePortfolioOrder = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order }
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    // Update each item's order
    await Promise.all(
      items.map(({ id, order }: { id: string; order: number }) =>
        PortfolioItem.findOneAndUpdate(
          { _id: id, userId },
          { $set: { order } }
        )
      )
    );

    res.json({ message: 'Portfolio order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating portfolio order' });
  }
};

// Toggle item featured status
export const toggleFeatured = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user._id;

    const item = await PortfolioItem.findOne({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    item.featured = !item.featured;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error toggling featured status' });
  }
};

// Toggle like on portfolio item
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = await PortfolioItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    // Toggle like count
    item.stats.likes = item.stats.likes > 0 ? item.stats.likes - 1 : item.stats.likes + 1;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error toggling like' });
  }
};
