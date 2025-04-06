import { Request } from 'express';
import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: any;
    }
    interface Multer extends multer.Multer {}
  }
}

export {};
