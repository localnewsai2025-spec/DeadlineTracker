import { prisma } from '../config/database';
import { AuthUtils } from '../utils/auth';
import { CreateUserData, UserFilters, PaginationParams } from '../types';
import { UserRole } from '@prisma/client';

export class UserService {
  static async createUser(userData: CreateUserData) {
    const hashedPassword = await AuthUtils.hashPassword(userData.password);
    
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getUsers(filters: UserFilters = {}, pagination: PaginationParams = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (filters.role) {
      where.role = filters.role;
    }
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUser(id: string, updateData: Partial<CreateUserData>) {
    const data: any = { ...updateData };
    
    if (updateData.password) {
      data.password = await AuthUtils.hashPassword(updateData.password);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async changeUserRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  static async getUserStats(userId: string) {
    const [totalTasks, completedTasks, overdueTasks, activeProjects] = await Promise.all([
      prisma.task.count({
        where: {
          OR: [
            { creatorId: userId },
            { assigneeId: userId },
          ],
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { creatorId: userId, status: 'COMPLETED' },
            { assigneeId: userId, status: 'COMPLETED' },
          ],
        },
      }),
      prisma.task.count({
        where: {
          OR: [
            { creatorId: userId, status: 'OVERDUE' },
            { assigneeId: userId, status: 'OVERDUE' },
          ],
        },
      }),
      prisma.projectMember.count({
        where: { userId },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      activeProjects,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }
}
