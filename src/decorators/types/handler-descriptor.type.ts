import { NextFunction, Request, Response } from 'express';

export type HandlerDescriptor = TypedPropertyDescriptor<
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<unknown> | unknown
>;