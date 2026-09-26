import { NextFunction, Request, Response } from 'express';
export class AppError extends Error { constructor(public status: number, message: string) { super(message); } }
export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => { const status = err instanceof AppError ? err.status : 500; if (status === 500) console.error(err); res.status(status).json({ error: err.message || 'Internal server error' }); };
