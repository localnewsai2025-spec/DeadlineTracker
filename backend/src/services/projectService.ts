import { prisma } from '../config/database';
import { CreateProjectData, ProjectFilters, PaginationParams } from '../types';
import { ProjectStatus } from '@prisma/client';

export class ProjectService {
  static async createProject(projectData: CreateProjectData, creatorId: string) {
    return prisma.project.create({
      data: {
        ...projectData,
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
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });
  }

  static async getProjectById(id: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        tasks: {
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
            _count: {
              select: {
                comments: true,
                attachments: true,
                reminders: true,
                subTasks: true,
              },
            },
          },
          orderBy: { deadline: 'asc' },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === userId ||
      project.members.some(member => member.userId === userId);

    return hasAccess ? project : null;
  }

  static async getProjects(filters: ProjectFilters = {}, pagination: PaginationParams = {}, userId: string) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { creatorId: userId },
        { members: { some: { userId } } },
      ],
    };

    // Додаємо фільтри
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.creatorId) {
      where.creatorId = filters.creatorId;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
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
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateProject(id: string, updateData: Partial<CreateProjectData>, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { creatorId: true, members: { select: { userId: true } } },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === userId ||
      project.members.some(member => member.userId === userId);

    if (!hasAccess) {
      return null;
    }

    return prisma.project.update({
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
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });
  }

  static async deleteProject(id: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!project) {
      return null;
    }

    // Тільки творець може видалити проєкт
    if (project.creatorId !== userId) {
      return null;
    }

    return prisma.project.delete({
      where: { id },
    });
  }

  static async addProjectMember(projectId: string, userId: string, role: string = 'member', currentUserId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true, members: { select: { userId: true } } },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === currentUserId ||
      project.members.some(member => member.userId === currentUserId);

    if (!hasAccess) {
      return null;
    }

    return prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  static async removeProjectMember(projectId: string, userId: string, currentUserId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true, members: { select: { userId: true } } },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === currentUserId ||
      project.members.some(member => member.userId === currentUserId);

    if (!hasAccess) {
      return null;
    }

    return prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  static async updateProjectMemberRole(projectId: string, userId: string, role: string, currentUserId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true, members: { select: { userId: true } } },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === currentUserId ||
      project.members.some(member => member.userId === currentUserId);

    if (!hasAccess) {
      return null;
    }

    return prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  static async getProjectStats(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true, members: { select: { userId: true } } },
    });

    if (!project) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      project.creatorId === userId ||
      project.members.some(member => member.userId === userId);

    if (!hasAccess) {
      return null;
    }

    const [totalTasks, completedTasks, overdueTasks, totalMembers] = await Promise.all([
      prisma.task.count({
        where: { projectId },
      }),
      prisma.task.count({
        where: { projectId, status: 'COMPLETED' },
      }),
      prisma.task.count({
        where: { 
          projectId, 
          deadline: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.projectMember.count({
        where: { projectId },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      totalMembers,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }
}
