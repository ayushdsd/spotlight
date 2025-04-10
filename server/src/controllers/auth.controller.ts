import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Use environment variables
const GOOGLE_ARTIST_CLIENT_ID = process.env.GOOGLE_ARTIST_CLIENT_ID;
const GOOGLE_ARTIST_CLIENT_SECRET = process.env.GOOGLE_ARTIST_CLIENT_SECRET;
const GOOGLE_RECRUITER_CLIENT_ID = process.env.GOOGLE_RECRUITER_CLIENT_ID;
const GOOGLE_RECRUITER_CLIENT_SECRET = process.env.GOOGLE_RECRUITER_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const googleCallback = async (req: Request, res: Response) => {
  try {
    // Check JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Received request body:', req.body);
    const { code, role } = req.body;

    if (!code) {
      console.log('No authorization code provided');
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    console.log('Attempting to exchange code for tokens');
    
    // Validate client secret
    const clientSecret = role === 'artist'
      ? process.env.GOOGLE_ARTIST_CLIENT_SECRET
      : process.env.GOOGLE_RECRUITER_CLIENT_SECRET;

    if (!clientSecret) {
      console.error('Client secret is not defined for role:', role);
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Log the request details (excluding secrets)
    const requestBody = {
      code,
      client_id: role === 'artist' 
        ? process.env.GOOGLE_ARTIST_CLIENT_ID
        : process.env.GOOGLE_RECRUITER_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173',
      grant_type: 'authorization_code'
    };

    console.log('Token exchange request details:', {
      ...requestBody,
      client_id_length: requestBody.client_id?.length,
      code_length: code?.length,
      client_secret_length: clientSecret.length,
      client_secret_prefix: clientSecret.substring(0, 6) // Log just the prefix to verify format
    });

    // Verify credentials format
    if (!requestBody.client_id?.endsWith('.apps.googleusercontent.com')) {
      console.error('Client ID format is incorrect');
      return res.status(500).json({ message: 'Invalid client ID format' });
    }

    if (!clientSecret.startsWith('GOCSPX-')) {
      console.error('Client secret format is incorrect');
      return res.status(500).json({ message: 'Invalid client secret format' });
    }

    // Create form data for token exchange
    const formData = new URLSearchParams();
    formData.append('code', code);
    formData.append('client_id', requestBody.client_id);
    formData.append('client_secret', clientSecret);
    formData.append('redirect_uri', requestBody.redirect_uri);
    formData.append('grant_type', requestBody.grant_type);

    // Exchange code for tokens directly with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange error:', error);
      console.error('Response status:', tokenResponse.status);
      console.error('Response headers:', Object.fromEntries(tokenResponse.headers.entries()));
      
      // Log the full request details for debugging (excluding the actual client secret)
      console.error('Full request details:', {
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        formData: {
          ...requestBody,
          client_secret: `[length: ${clientSecret.length}]`
        }
      });

      // Try to get more detailed error information
      const errorText = await tokenResponse.text().catch(() => 'Could not get response text');
      console.error('Full error response:', errorText);
      
      return res.status(400).json({ 
        message: 'Failed to exchange code for token', 
        error,
        details: {
          status: tokenResponse.status,
          headers: Object.fromEntries(tokenResponse.headers.entries()),
          responseText: errorText
        }
      });
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
      { expiresIn: '7d' }
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
    console.error('Auth callback error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
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
