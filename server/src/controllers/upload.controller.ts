import { Request, Response } from 'express';
import { cloudinaryUpload } from '../utils/cloudinary';
import User from '../models/user.model';

// Generic file upload
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user._id;

    const result = await cloudinaryUpload(req.file, {
      folder: `users/${userId}/uploads`,
      resource_type: 'auto',
    });

    res.status(201).json({
      url: result.secure_url,
      size: result.bytes,
      format: result.format,
      ...(result.duration && { duration: result.duration }),
      ...(result.width && {
        dimensions: {
          width: result.width,
          height: result.height,
        },
      }),
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error?.message || 'Error uploading file' });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user._id;

    const result = await cloudinaryUpload(req.file, {
      folder: `users/${userId}/profile_pictures`,
      resource_type: 'image',
    });

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profilePicture: user.profilePicture });
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: error?.message || 'Error uploading profile picture' });
  }
};

// Upload message attachment
export const uploadMessageAttachment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user._id;

    const result = await cloudinaryUpload(req.file, {
      folder: `users/${userId}/message-attachments`,
      resource_type: 'auto',
    });

    res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Error uploading message attachment:', error);
    res.status(500).json({ error: error?.message || 'Error uploading message attachment' });
  }
};

// Upload portfolio images
export const uploadPortfolioImages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const userId = req.user._id;

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map((file: Express.Multer.File) =>
      cloudinaryUpload(file, {
        folder: `users/${userId}/portfolio_images`,
        resource_type: 'image',
      })
    );

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.secure_url);

    // Update user's portfolio images
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { portfolioImages: { $each: imageUrls } } },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ portfolioImages: user.portfolioImages });
  } catch (error: any) {
    console.error('Error uploading portfolio images:', error);
    res.status(500).json({ error: error?.message || 'Error uploading portfolio images' });
  }
};
