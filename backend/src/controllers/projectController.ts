import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateProjectData, ProjectFilters, PaginationParams } from '../types';
import { AuthRequest } from '../middleware/auth';

export class ProjectController {
  static createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectData: CreateProjectData = req.body;
    const userId = req.user!.id;

    const project = await ProjectService.createProject(projectData, userId);
    if (!project) {
      ResponseUtils.badRequest(res, 'Не вдалося створити проєкт');
      return;
    }

    ResponseUtils.created(res, project, 'Проєкт успішно створено');
  });

  static getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await ProjectService.getProjectById(id, userId);
    if (!project) {
      ResponseUtils.notFound(res, 'Проєкт не знайдено або у вас немає доступу');
      return;
    }

    ResponseUtils.success(res, project, 'Проєкт знайдено');
  });

  static getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const filters: ProjectFilters = {};
    const pagination: PaginationParams = {};

    // Парсимо фільтри
    if (req.query.status) filters.status = req.query.status as any;
    if (req.query.creatorId) filters.creatorId = req.query.creatorId as string;

    // Парсимо пагінацію
    if (req.query.page) pagination.page = parseInt(req.query.page as string);
    if (req.query.limit) pagination.limit = parseInt(req.query.limit as string);
    if (req.query.sortBy) pagination.sortBy = req.query.sortBy as string;
    if (req.query.sortOrder) pagination.sortOrder = req.query.sortOrder as 'asc' | 'desc';

    const result = await ProjectService.getProjects(filters, pagination, userId);
    ResponseUtils.paginated(res, result.data, result.pagination, 'Проєкти отримано');
  });

  static updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData: Partial<CreateProjectData> = req.body;
    const userId = req.user!.id;

    const project = await ProjectService.updateProject(id, updateData, userId);
    if (!project) {
      ResponseUtils.notFound(res, 'Проєкт не знайдено або у вас немає прав для редагування');
      return;
    }

    ResponseUtils.success(res, project, 'Проєкт успішно оновлено');
  });

  static deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await ProjectService.deleteProject(id, userId);
    if (!project) {
      ResponseUtils.notFound(res, 'Проєкт не знайдено або у вас немає прав для видалення');
      return;
    }

    ResponseUtils.success(res, null, 'Проєкт успішно видалено');
  });

  static addProjectMember = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { userId, role } = req.body;
    const currentUserId = req.user!.id;

    const member = await ProjectService.addProjectMember(id, userId, role, currentUserId);
    if (!member) {
      ResponseUtils.notFound(res, 'Проєкт не знайдено або у вас немає прав для додавання учасників');
      return;
    }

    ResponseUtils.created(res, member, 'Учасник успішно доданий до проєкту');
  });

  static removeProjectMember = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id, userId } = req.params;
    const currentUserId = req.user!.id;

    const member = await ProjectService.removeProjectMember(id, userId, currentUserId);
    if (!member) {
      ResponseUtils.notFound(res, 'Проєкт або учасник не знайдено, або у вас немає прав для видалення');
      return;
    }

    ResponseUtils.success(res, null, 'Учасник успішно видалений з проєкту');
  });

  static updateProjectMemberRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id, userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.user!.id;

    const member = await ProjectService.updateProjectMemberRole(id, userId, role, currentUserId);
    if (!member) {
      ResponseUtils.notFound(res, 'Проєкт або учасник не знайдено, або у вас немає прав для зміни ролі');
      return;
    }

    ResponseUtils.success(res, member, 'Роль учасника успішно оновлена');
  });

  static getProjectStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const stats = await ProjectService.getProjectStats(id, userId);
    if (!stats) {
      ResponseUtils.notFound(res, 'Проєкт не знайдено або у вас немає доступу');
      return;
    }

    ResponseUtils.success(res, stats, 'Статистика проєкту');
  });
}
