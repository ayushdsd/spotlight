import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Use environment variables
const GOOGLE_ARTIST_CLIENT_ID = process.env.GOOGLE_ARTIST_CLIENT_ID;
const GOOGLE_ARTIST_CLIENT_SECRET = process.env.GOOGLE_ARTIST_CLIENT_SECRET;
const GOOGLE_RECRUITER_CLIENT_ID = process.env.GOOGLE_RECRUITER_CLIENT_ID;
const GOOGLE_RECRUITER_CLIENT_SECRET = process.env.GOOGLE_RECRUITER_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, role } = req.body;

    if (!code || !role) {
      console.error('Missing required fields:', { code: !!code, role });
      return res.status(400).json({ message: 'Code and role are required' });
    }

    console.log('Received Google callback:', {
      code: code.substring(0, 10) + '...',
      role,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    // Get the appropriate client ID and secret based on role
    const clientId = role === 'artist' 
      ? process.env.GOOGLE_ARTIST_CLIENT_ID 
      : process.env.GOOGLE_RECRUITER_CLIENT_ID;
    const clientSecret = role === 'artist'
      ? process.env.GOOGLE_ARTIST_CLIENT_SECRET
      : process.env.GOOGLE_RECRUITER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials:', {
        hasArtistId: !!process.env.GOOGLE_ARTIST_CLIENT_ID,
        hasArtistSecret: !!process.env.GOOGLE_ARTIST_CLIENT_SECRET,
        hasRecruiterId: !!process.env.GOOGLE_RECRUITER_CLIENT_ID,
        hasRecruiterSecret: !!process.env.GOOGLE_RECRUITER_CLIENT_SECRET
      });
      return res.status(500).json({ message: 'OAuth configuration error' });
    }

    const oauth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      process.env.GOOGLE_REDIRECT_URI
    );

    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Token exchange successful');

    if (!tokens.access_token) {
      console.error('No access token received');
      return res.status(400).json({ message: 'Failed to get access token' });
    }

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const userInfo = await oauth2.userinfo.get();
    console.log('Got user info:', {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name
    });

    if (!userInfo.data.email) {
      console.error('No email in user info');
      return res.status(400).json({ message: 'Email not found in Google account' });
    }

    // Find or create user
    let user = await User.findOne({ email: userInfo.data.email });

    if (!user) {
      console.log('Creating new user');
      user = new User({
        email: userInfo.data.email,
        name: userInfo.data.name,
        profilePicture: userInfo.data.picture,
        role: role
      });
      await user.save();
    } else {
      console.log('Found existing user:', user._id);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Authentication successful, sending response');
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Google callback error:', {
      message: error.message,
      stack: error.stack,
      details: error.response?.data
    });
    
    return res.status(400).json({
      message: 'Failed to exchange code for token',
      error: error.message,
      details: error.response?.data
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
