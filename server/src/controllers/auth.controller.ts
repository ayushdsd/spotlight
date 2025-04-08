import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model';

// Use environment variables or fallback to development values
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '145576867531-u3ddl3c8s6ujmbrbll0divpb06s704mu.apps.googleusercontent.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token, email, name, picture, role } = req.body;

    if (!token || !email || !name) {
      return res.status(400).json({ message: 'Token, email and name are required' });
    }

    try {
      // Verify the Google token by making a request to Google's userinfo endpoint
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Invalid token');
      }

      const userInfo = await userInfoResponse.json();
      
      if (userInfo.email !== email) {
        return res.status(401).json({ message: 'Email mismatch' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Token verification failed' });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        role: role || 'artist' // Use provided role or default to artist
      });
    } else {
      // Update existing user's info
      user.name = name;
      user.profilePicture = picture || user.profilePicture;
      user.role = role || user.role;
      await user.save();
    }

    // Generate JWT token
    const authToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};
