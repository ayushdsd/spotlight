import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      name: string;
      email: string;
      role: 'artist' | 'recruiter';
      profilePicture?: string;
    }
  }
}
