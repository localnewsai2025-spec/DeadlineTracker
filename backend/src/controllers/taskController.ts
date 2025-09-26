import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateTaskData, UpdateTaskData, TaskFilters, PaginationParams } from '../types';
import { AuthRequest } from '../middleware/auth';

export class TaskController {
  static createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const taskData: CreateTaskData = req.body;
    const userId = req.user!.id;

    const task = await TaskService.createTask(taskData, userId);
    if (!task) {
      ResponseUtils.badRequest(res, 'Не вдалося створити завдання');
      return;
    }

    ResponseUtils.created(res, task, 'Завдання успішно створено');
  });

  static getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await TaskService.getTaskById(id, userId);
    if (!task) {
      ResponseUtils.notFound(res, 'Завдання не знайдено або у вас немає доступу');
      return;
    }

    ResponseUtils.success(res, task, 'Завдання знайдено');
  });

  static getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const filters: TaskFilters = {};
    const pagination: PaginationParams = {};

    // Парсимо фільтри
    if (req.query.status) filters.status = req.query.status as any;
    if (req.query.priority) filters.priority = req.query.priority as any;
    if (req.query.assigneeId) filters.assigneeId = req.query.assigneeId as string;
    if (req.query.projectId) filters.projectId = req.query.projectId as string;
    if (req.query.deadlineFrom) filters.deadlineFrom = new Date(req.query.deadlineFrom as string);
    if (req.query.deadlineTo) filters.deadlineTo = new Date(req.query.deadlineTo as string);

    // Парсимо пагінацію
    if (req.query.page) pagination.page = parseInt(req.query.page as string);
    if (req.query.limit) pagination.limit = parseInt(req.query.limit as string);
    if (req.query.sortBy) pagination.sortBy = req.query.sortBy as string;
    if (req.query.sortOrder) pagination.sortOrder = req.query.sortOrder as 'asc' | 'desc';

    const result = await TaskService.getTasks(filters, pagination, userId);
    ResponseUtils.paginated(res, result.data, result.pagination, 'Завдання отримано');
  });

  static updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateTaskData = req.body;
    const userId = req.user!.id;

    const task = await TaskService.updateTask(id, updateData, userId);
    if (!task) {
      ResponseUtils.notFound(res, 'Завдання не знайдено або у вас немає прав для редагування');
      return;
    }

    ResponseUtils.success(res, task, 'Завдання успішно оновлено');
  });

  static deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await TaskService.deleteTask(id, userId);
    if (!task) {
      ResponseUtils.notFound(res, 'Завдання не знайдено або у вас немає прав для видалення');
      return;
    }

    ResponseUtils.success(res, null, 'Завдання успішно видалено');
  });

  static updateTaskStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const task = await TaskService.updateTaskStatus(id, status, userId);
    if (!task) {
      ResponseUtils.notFound(res, 'Завдання не знайдено або у вас немає прав для зміни статусу');
      return;
    }

    ResponseUtils.success(res, task, 'Статус завдання успішно оновлено');
  });

  static getOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const tasks = await TaskService.getOverdueTasks(userId);
    ResponseUtils.success(res, tasks, 'Прострочені завдання');
  });

  static getUpcomingTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;

    const tasks = await TaskService.getUpcomingTasks(userId, days);
    ResponseUtils.success(res, tasks, 'Майбутні завдання');
  });

  static getTaskStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const stats = await TaskService.getTaskStats(userId);
    ResponseUtils.success(res, stats, 'Статистика завдань');
  });
}
