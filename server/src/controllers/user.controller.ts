import { Request, Response } from 'express';
import User from '../models/user.model';
import { cloudinaryUpload } from '../utils/cloudinary';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // If userId is provided in params, get that user's profile
    // Otherwise, get the authenticated user's profile
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      skills: user.skills || [],
      portfolioImages: user.portfolioImages || [],
      experience: user.experience || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      skills: user.skills || [],
      portfolioImages: user.portfolioImages || [],
      experience: user.experience || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Error updating user profile' });
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

    // Upload to Cloudinary
    const result = await cloudinaryUpload(req.file, {
      folder: `users/${req.user._id}/profile`,
      resource_type: 'image',
    });

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePicture: result.secure_url } },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
};
