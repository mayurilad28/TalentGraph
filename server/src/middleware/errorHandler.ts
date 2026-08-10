import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('💥 Server Error:', err);

  const status = err.status || 500;
  let message = err.message || 'An unexpected internal server error occurred';

  // Handle specific Neo4j / CognoDB database errors
  if (err.code === 'ServiceUnavailable' || err.message?.includes('Connection refused') || err.message?.includes('ENOTFOUND')) {
    message = 'CognoDB graph database is currently unreachable. Please check connection URI and credentials.';
  } else if (err.code === 'Neo.ClientError.Security.Unauthorized') {
    message = 'Authentication failed: Invalid CognoDB username or password.';
  }

  res.status(status).json({
    data: null,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
}
