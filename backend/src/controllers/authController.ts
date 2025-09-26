import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateUserData, LoginData } from '../types';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const userData: CreateUserData = req.body;

    // Перевіряємо, чи користувач вже існує
    const existingUser = await UserService.getUserByEmail(userData.email);
    if (existingUser) {
      ResponseUtils.badRequest(res, 'Користувач з таким email вже існує');
      return;
    }

    const user = await UserService.createUser(userData);
    const token = AuthUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    ResponseUtils.created(res, {
      user,
      token,
    }, 'Користувач успішно зареєстрований');
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: LoginData = req.body;

    // Знаходимо користувача
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      ResponseUtils.unauthorized(res, 'Невірний email або пароль');
      return;
    }

    // Перевіряємо пароль
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      ResponseUtils.unauthorized(res, 'Невірний email або пароль');
      return;
    }

    // Перевіряємо, чи користувач активний
    if (!user.isActive) {
      ResponseUtils.unauthorized(res, 'Обліковий запис деактивований');
      return;
    }

    const token = AuthUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    ResponseUtils.success(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    }, 'Успішний вхід в систему');
  });

  static getProfile = asyncHandler(async (req: any, res: Response) => {
    const user = await UserService.getUserById(req.user.id);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, user, 'Профіль користувача');
  });

  static updateProfile = asyncHandler(async (req: any, res: Response) => {
    const { firstName, lastName, email } = req.body;
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    const user = await UserService.updateUser(req.user.id, updateData);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    ResponseUtils.success(res, user, 'Профіль оновлено');
  });

  static changePassword = asyncHandler(async (req: any, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    // Отримуємо поточного користувача
    const user = await UserService.getUserByEmail(req.user.email);
    if (!user) {
      ResponseUtils.notFound(res, 'Користувач не знайдений');
      return;
    }

    // Перевіряємо поточний пароль
    const isCurrentPasswordValid = await AuthUtils.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      ResponseUtils.badRequest(res, 'Невірний поточний пароль');
      return;
    }

    // Оновлюємо пароль
    await UserService.updateUser(req.user.id, { password: newPassword });

    ResponseUtils.success(res, null, 'Пароль успішно змінено');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    // У JWT токенах logout зазвичай реалізується на клієнті
    // Тут можна додати логіку для чорного списку токенів, якщо потрібно
    ResponseUtils.success(res, null, 'Успішний вихід з системи');
  });
}
