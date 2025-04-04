import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
      picture?: string;
      role: 'artist' | 'recruiter';
    };
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id) as IUser;

    if (!user) {
      throw new Error();
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};
