import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
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

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        role,
        picture,
        googleId: sub,
      });
      await user.save();
    } else {
      // Update existing user's role if different
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({ user, token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
