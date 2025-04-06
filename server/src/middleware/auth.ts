import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: 'artist' | 'recruiter';
        profilePicture?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as {
      _id: string;
      name: string;
      email: string;
      role: 'artist' | 'recruiter';
      profilePicture?: string;
    };

    // Set user info in request
    req.user = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      profilePicture: decoded.profilePicture,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
