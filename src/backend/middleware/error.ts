import { Request, Response, NextFunction } from 'express';

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res
    .status(500)
    .json({ error: error.message });
}

export default errorMiddleware;
