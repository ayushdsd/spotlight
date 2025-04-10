import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Use environment variables
const JWT_SECRET = process.env.JWT_SECRET;

export const googleCallback = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);
    const { code, role } = req.body;

    if (!code) {
      console.log('No authorization code provided');
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    console.log('Attempting to exchange code for tokens');
    // Exchange code for tokens directly with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: role === 'artist' 
          ? process.env.GOOGLE_ARTIST_CLIENT_ID as string
          : process.env.GOOGLE_RECRUITER_CLIENT_ID as string,
        client_secret: role === 'artist'
          ? process.env.GOOGLE_ARTIST_CLIENT_SECRET as string
          : process.env.GOOGLE_RECRUITER_CLIENT_SECRET as string,
        redirect_uri: 'https://spotlight-frontend.vercel.app',
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange error:', error);
      return res.status(400).json({ message: 'Failed to exchange code for token', error });
    }
 
    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: 'Failed to get access token' });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const userInfo = await userInfoResponse.json();

    // Find or create user
    let user = await User.findOne({ email: userInfo.email });

    if (!user) {
      user = await User.create({
        email: userInfo.email,
        name: userInfo.name,
        profilePicture: userInfo.picture,
        role: role || 'artist' // Use provided role or default to artist
      });
    } else {
      // Update existing user's info
      user.name = userInfo.name;
      user.profilePicture = userInfo.picture || user.profilePicture;
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
      userInfo: {
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
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
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};
