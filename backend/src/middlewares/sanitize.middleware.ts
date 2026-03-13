import { Request, Response, NextFunction } from "express";
export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  // TODO: Add DOMPurify or express-mongo-sanitize equivalent
  next();
}
