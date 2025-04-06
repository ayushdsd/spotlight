import { Express as ExpressType } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: any;
    }
  }
}

export {};
