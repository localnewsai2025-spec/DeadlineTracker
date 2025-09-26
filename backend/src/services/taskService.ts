import { prisma } from '../config/database';
import { CreateTaskData, UpdateTaskData, TaskFilters, PaginationParams } from '../types';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskService {
  static async createTask(taskData: CreateTaskData, creatorId: string) {
    return prisma.task.create({
      data: {
        ...taskData,
        creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            title: true,
          },
        },
        subTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            deadline: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
            reminders: true,
          },
        },
      },
    });
  }

  static async getTaskById(id: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            title: true,
          },
        },
        subTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            deadline: true,
            priority: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reminders: {
          where: { userId },
          orderBy: { remindAt: 'asc' },
        },
      },
    });

    if (!task) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      task.creatorId === userId ||
      task.assigneeId === userId ||
      (task.project && await this.isProjectMember(userId, task.projectId!));

    return hasAccess ? task : null;
  }

  static async getTasks(filters: TaskFilters = {}, pagination: PaginationParams = {}, userId: string) {
    const { page = 1, limit = 10, sortBy = 'deadline', sortOrder = 'asc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { creatorId: userId },
        { assigneeId: userId },
      ],
    };

    // Додаємо фільтри
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.priority) {
      where.priority = filters.priority;
    }
    
    if (filters.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }
    
    if (filters.projectId) {
      where.projectId = filters.projectId;
    }
    
    if (filters.deadlineFrom || filters.deadlineTo) {
      where.deadline = {};
      if (filters.deadlineFrom) {
        where.deadline.gte = filters.deadlineFrom;
      }
      if (filters.deadlineTo) {
        where.deadline.lte = filters.deadlineTo;
      }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
              reminders: true,
              subTasks: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateTask(id: string, updateData: UpdateTaskData, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { creatorId: true, assigneeId: true, projectId: true },
    });

    if (!task) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      task.creatorId === userId ||
      task.assigneeId === userId ||
      (task.projectId && await this.isProjectMember(userId, task.projectId));

    if (!hasAccess) {
      return null;
    }

    return prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            title: true,
          },
        },
        subTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            deadline: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
            reminders: true,
          },
        },
      },
    });
  }

  static async deleteTask(id: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { creatorId: true, projectId: true },
    });

    if (!task) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      task.creatorId === userId ||
      (task.projectId && await this.isProjectMember(userId, task.projectId));

    if (!hasAccess) {
      return null;
    }

    return prisma.task.delete({
      where: { id },
    });
  }

  static async updateTaskStatus(id: string, status: TaskStatus, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { creatorId: true, assigneeId: true, projectId: true },
    });

    if (!task) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      task.creatorId === userId ||
      task.assigneeId === userId ||
      (task.projectId && await this.isProjectMember(userId, task.projectId));

    if (!hasAccess) {
      return null;
    }

    return prisma.task.update({
      where: { id },
      data: { status },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async getOverdueTasks(userId: string) {
    const now = new Date();
    
    return prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assigneeId: userId },
        ],
        deadline: { lt: now },
        status: { not: 'COMPLETED' },
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  }

  static async getUpcomingTasks(userId: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assigneeId: userId },
        ],
        deadline: { gte: now, lte: futureDate },
        status: { not: 'COMPLETED' },
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  }

  static async getTaskStats(userId: string) {
    const [total, completed, pending, overdue] = await Promise.all([
      prisma.task.count({
        where: {
          OR: [
            { assigneeId: userId },
            { creatorId: userId },
          ],
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { assigneeId: userId },
            { creatorId: userId },
          ],
          status: TaskStatus.COMPLETED,
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { assigneeId: userId },
            { creatorId: userId },
          ],
          status: {
            in: [TaskStatus.NOT_STARTED, TaskStatus.IN_PROGRESS],
          },
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { assigneeId: userId },
            { creatorId: userId },
          ],
          deadline: {
            lt: new Date(),
          },
          status: {
            not: TaskStatus.COMPLETED,
          },
        },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  private static async isProjectMember(userId: string, projectId: string): Promise<boolean> {
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
    return !!member;
  }
}
