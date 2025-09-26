import { Request, Response } from 'express';
import { ReminderService } from '../services/reminderService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateReminderData } from '../types';
import { AuthRequest } from '../middleware/auth';

export class ReminderController {
  static createReminder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reminderData: CreateReminderData = req.body;
    const userId = req.user!.id;

    const reminder = await ReminderService.createReminder(reminderData, userId);
    if (!reminder) {
      ResponseUtils.badRequest(res, 'Не вдалося створити нагадування або у вас немає доступу до завдання');
      return;
    }

    ResponseUtils.created(res, reminder, 'Нагадування успішно створено');
  });

  static getRemindersByTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const userId = req.user!.id;

    const reminders = await ReminderService.getRemindersByTask(taskId, userId);
    if (!reminders) {
      ResponseUtils.notFound(res, 'Завдання не знайдено або у вас немає доступу');
      return;
    }

    ResponseUtils.success(res, reminders, 'Нагадування для завдання');
  });

  static updateReminder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData: Partial<CreateReminderData> = req.body;
    const userId = req.user!.id;

    const reminder = await ReminderService.updateReminder(id, updateData, userId);
    if (!reminder) {
      ResponseUtils.notFound(res, 'Нагадування не знайдено або у вас немає прав для редагування');
      return;
    }

    ResponseUtils.success(res, reminder, 'Нагадування успішно оновлено');
  });

  static deleteReminder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const reminder = await ReminderService.deleteReminder(id, userId);
    if (!reminder) {
      ResponseUtils.notFound(res, 'Нагадування не знайдено або у вас немає прав для видалення');
      return;
    }

    ResponseUtils.success(res, null, 'Нагадування успішно видалено');
  });

  static getUpcomingReminders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;

    const reminders = await ReminderService.getUpcomingReminders(userId, days);
    ResponseUtils.success(res, reminders, 'Майбутні нагадування');
  });
}
