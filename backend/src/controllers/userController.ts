import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { UserFilters, PaginationParams } from '../types';
import { AuthRequest } from '../middleware/auth';
import { UserRole } from '@prisma/client';

export class UserController {
  static getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters: UserFilters = {};
    const pagination: PaginationParams = {};

    // Парсимо фільтри
    if (req.query.role) filters.role = req.query.role as UserRole;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    // Парсимо пагінацію
    if (req.query.page) pagination.page = parseInt(req.query.page as string);
    if (req.query.limit) pagination.limit = parseInt(req.query.limit as string);
    if (req.query.sortBy) pagination.sortBy = req.query.sortBy as string;
    if (req.query.sortOrder) pagination.sortOrder = req.query.sortOrder as 'asc' | 'desc';

    const result = await UserService.getUsers(filters, pagination);
    ResponseUtils.paginated(res, result.data, result.pagination, 'Користувачі отримано');
  });

  static getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await UserService.getUserById(id);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, user, 'Користувач знайдений');
  });

  static updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const currentUserId = req.user!.id;
    const currentUserRole = req.user!.role;

    // Перевіряємо права доступу
    if (id !== currentUserId && currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      ResponseUtils.forbidden(res, 'У вас немає прав для редагування цього користувача');
      return;
    }

    const user = await UserService.updateUser(id, updateData);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, user, 'Користувач успішно оновлений');
  });

  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user!.id;
    const currentUserRole = req.user!.role;

    // Перевіряємо права доступу
    if (id !== currentUserId && currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      ResponseUtils.forbidden(res, 'У вас немає прав для видалення цього користувача');
      return;
    }

    const user = await UserService.deleteUser(id);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, null, 'Користувач успішно видалений');
  });

  static changeUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const currentUserRole = req.user!.role;

    // Перевіряємо права доступу
    if (currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      ResponseUtils.forbidden(res, 'У вас немає прав для зміни ролей користувачів');
      return;
    }

    const user = await UserService.changeUserRole(id, role);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, user, 'Роль користувача успішно змінена');
  });

  static getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user!.id;
    const currentUserRole = req.user!.role;

    // Перевіряємо права доступу
    if (id !== currentUserId && currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      ResponseUtils.forbidden(res, 'У вас немає прав для перегляду статистики цього користувача');
      return;
    }

    const stats = await UserService.getUserStats(id);
    ResponseUtils.success(res, stats, 'Статистика користувача');
  });
}
