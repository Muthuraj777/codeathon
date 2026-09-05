import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Performance timing middleware adding X-Response-Time header
 */
export const responseTimeTracker = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  // Override res.setHeader or patch writeHead to append timing before headers are sent
  const originalWriteHead = res.writeHead;
  res.writeHead = function (this: Response, ...args: any[]): Response {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    this.setHeader('X-Response-Time', `${timeInMs}ms`);
    return originalWriteHead.apply(this, args as any);
  };

  next();
};

/**
 * Rate limiting middleware to prevent API abuse
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.',
  },
});
