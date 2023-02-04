import { MiddlewareType } from '../types/middleware.type';
import { ApiError } from '../exceptions/api-error.exception';

export const handlerApiErrorMiddleware: MiddlewareType = (
  err,
  req,
  res,
  next
) => {
  if (err) {
    if (err instanceof ApiError)
      return res.status(err.status).json({ message: err.message });
    else return res.status(500).json({ message: err ?? 'unhandled error' });
  }
  next && next();
};