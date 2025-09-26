import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';
import { prisma } from '../config/database';
import { UserRole } from '../types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      ResponseUtils.unauthorized(res, 'Токен доступу не надано');
      return;
    }

    const decoded = AuthUtils.verifyToken(token);
    if (!decoded) {
      ResponseUtils.unauthorized(res, 'Невірний токен доступу');
      return;
    }

    // Перевіряємо, чи користувач існує та активний
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      ResponseUtils.unauthorized(res, 'Користувач не знайдений або неактивний');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    ResponseUtils.unauthorized(res, 'Помилка автентифікації');
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Користувач не автентифікований');
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseUtils.forbidden(res, 'Недостатньо прав доступу');
      return;
    }

    next();
  };
};

export const requireRole = (role: UserRole) => {
  return authorize(role);
};

export const requireAdmin = authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN);
export const requireSuperAdmin = authorize(UserRole.SUPER_ADMIN);
export const requireProjectLead = authorize(UserRole.PROJECT_LEAD, UserRole.ADMIN, UserRole.SUPER_ADMIN);
