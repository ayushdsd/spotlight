declare namespace Express {
  interface Request {
    user?: any;
    file?: any;
  }
}

declare module 'express' {
  export interface Request {
    user?: any;
    file?: any;
  }
}
