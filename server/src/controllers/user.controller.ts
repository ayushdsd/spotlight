import { Request, Response } from 'express';
import User from '../models/user.model';
import { cloudinaryUpload } from '../utils/cloudinary';
import mongoose from 'mongoose';

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
      portfolioLinks: user.portfolioLinks || [],
      experience: user.experience || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
      },
      actorDetails: user.actorDetails || {
        height: '',
        weight: '',
        eyeColor: '',
        hairColor: '',
        specialSkills: [],
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
      portfolioLinks: user.portfolioLinks || [],
      experience: user.experience || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
      },
      actorDetails: user.actorDetails || {
        height: '',
        weight: '',
        eyeColor: '',
        hairColor: '',
        specialSkills: [],
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

// --- FOLLOWING SYSTEM ---
export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?._id;
    const followeeId = req.params.userId;
    if (!followerId || !followeeId || followerId === followeeId) {
      return res.status(400).json({ error: 'Invalid follow request' });
    }
    await User.findByIdAndUpdate(followeeId, { $addToSet: { followers: followerId } });
    await User.findByIdAndUpdate(followerId, { $addToSet: { following: followeeId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?._id;
    const followeeId = req.params.userId;
    if (!followerId || !followeeId || followerId === followeeId) {
      return res.status(400).json({ error: 'Invalid unfollow request' });
    }
    await User.findByIdAndUpdate(followeeId, { $pull: { followers: followerId } });
    await User.findByIdAndUpdate(followerId, { $pull: { following: followeeId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

export const getFollowStatus = async (req: Request, res: Response) => {
  try {
    const myId = req.user?._id;
    const userId = req.params.userId;
    if (!myId || !userId) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const user = await User.findById(userId);
    const me = await User.findById(myId);
    if (!user || !me) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isFollowing = me.following?.map(String).includes(String(userId));
    const isFollowedBy = me.followers?.map(String).includes(String(userId));
    res.json({ isFollowing, isFollowedBy });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get follow status' });
  }
};
