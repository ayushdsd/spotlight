import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'artist' | 'recruiter';
}

interface AuthRequest extends ExpressRequest {
  user?: User;
}

const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as User;
    // Fetch the user from the database using _id from the JWT
    const user = await User.findById((decoded as any)._id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Ensure _id is a string
    req.user = {
      ...user,
      _id: user._id.toString(),
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as User;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export default auth;
