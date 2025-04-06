import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import axios from 'axios';

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { googleToken, role } = req.body;

    // Verify Google token and get user info
    const { data: userInfo } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      }
    );

    const { sub, name, email, picture } = userInfo;

    let user = await User.findOne({ email }).exec();

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        role: role || 'artist',
        profilePicture: picture,
        googleId: sub,
        skills: [],
        portfolioImages: [],
        experience: [],
        education: [],
        socialLinks: {
          website: '',
          linkedin: '',
          twitter: '',
          instagram: '',
        },
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
