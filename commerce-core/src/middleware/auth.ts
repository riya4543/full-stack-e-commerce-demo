import { Role } from '@prisma/client'; import { NextFunction, Request, Response } from 'express'; import jwt from 'jsonwebtoken'; import { AppError } from '../utils/http';
const secret = () => process.env.JWT_SECRET || 'unsafe-dev-secret-change-me';
export const authenticate = (req: Request, _: Response, next: NextFunction) => { const token = req.header('authorization')?.replace('Bearer ', ''); if (!token) throw new AppError(401, 'Authentication required'); try { req.user = jwt.verify(token, secret()) as { id:string; role:Role }; next(); } catch { throw new AppError(401, 'Invalid or expired token'); } };
export const authorize = (...roles: Role[]) => (req: Request, _: Response, next: NextFunction) => { if (!req.user || !roles.includes(req.user.role)) throw new AppError(403, 'Insufficient permissions'); next(); };
export const signToken = (id: string, role: Role) => jwt.sign({ id, role }, secret(), { expiresIn: '1h' });
