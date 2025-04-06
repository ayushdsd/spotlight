/// <reference types="express-serve-static-core" />

import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express-serve-static-core';
import { Send } from 'express-serve-static-core';

declare global {
  namespace Express {
    export interface User {
      _id: string;
      name: string;
      email: string;
      role: "artist" | "recruiter";
      profilePicture?: string;
    }

    export interface Request extends ExpressRequest {
      user?: User;
      files?: {
        [fieldname: string]: Express.Multer.File[];
      };
      file?: Express.Multer.File;
      body: any;
      query: any;
      params: any;
      headers: any;
    }

    export interface Response extends ExpressResponse {
      status(code: number): this;
      json: Send<any, this>;
    }
  }
}

declare module 'express' {
  export interface User {
    _id: string;
    name: string;
    email: string;
    role: "artist" | "recruiter";
    profilePicture?: string;
  }

  export interface Request extends ExpressRequest {
    user?: User;
    files?: {
      [fieldname: string]: Express.Multer.File[];
    };
    file?: Express.Multer.File;
    body: any;
    query: any;
    params: any;
    headers: any;
  }

  export interface Response extends ExpressResponse {
    status(code: number): this;
    json: Send<any, this>;
  }

  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }

  export interface ErrorRequestHandler {
    (err: any, req: Request, res: Response, next: NextFunction): void;
  }

  export interface Router {
    use(handler: RequestHandler | ErrorRequestHandler): this;
    use(path: string, handler: RequestHandler | ErrorRequestHandler): this;
    get(path: string, ...handlers: RequestHandler[]): this;
    post(path: string, ...handlers: RequestHandler[]): this;
    put(path: string, ...handlers: RequestHandler[]): this;
    delete(path: string, ...handlers: RequestHandler[]): this;
  }

  export interface Application {
    use(handler: RequestHandler | ErrorRequestHandler): this;
    use(path: string, handler: RequestHandler | ErrorRequestHandler): this;
    use(path: string, router: Router): this;
    listen(port: number, callback?: () => void): this;
    json(): RequestHandler;
    urlencoded(options: any): RequestHandler;
    get(name: string): any;
    get(path: string, ...handlers: RequestHandler[]): this;
    post(path: string, ...handlers: RequestHandler[]): this;
    put(path: string, ...handlers: RequestHandler[]): this;
    delete(path: string, ...handlers: RequestHandler[]): this;
    set(setting: string, val: any): this;
  }

  export interface Express {
    (): Application;
    Router(): Router;
    json(): RequestHandler;
    urlencoded(options: any): RequestHandler;
  }

  export { NextFunction };

  const express: Express;
  export default express;
}
