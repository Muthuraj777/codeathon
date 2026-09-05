import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    const issues = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: issues,
    });
    return;
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    res.status(400).json({
      status: 'fail',
      message: 'Email address already in use.',
    });
    return;
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
