import { prisma } from '../config/database';
import { CreateReminderData } from '../types';
import { ReminderType } from '@prisma/client';
import * as admin from 'firebase-admin';

export class ReminderService {
  static async createReminder(reminderData: CreateReminderData, userId: string) {
    // Перевіряємо, чи користувач має доступ до завдання
    const task = await prisma.task.findUnique({
      where: { id: reminderData.taskId },
      select: { 
        id: true, 
        title: true, 
        deadline: true,
        creatorId: true, 
        assigneeId: true,
        projectId: true,
      },
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

    return prisma.reminder.create({
      data: {
        ...reminderData,
        userId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            deadline: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  static async getRemindersByTask(taskId: string, userId: string) {
    // Перевіряємо, чи користувач має доступ до завдання
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { 
        id: true, 
        creatorId: true, 
        assigneeId: true,
        projectId: true,
      },
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

    return prisma.reminder.findMany({
      where: { taskId, userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            deadline: true,
          },
        },
      },
      orderBy: { remindAt: 'asc' },
    });
  }

  static async updateReminder(id: string, updateData: Partial<CreateReminderData>, userId: string) {
    const reminder = await prisma.reminder.findUnique({
      where: { id },
      select: { 
        id: true, 
        userId: true, 
        taskId: true,
        task: {
          select: {
            creatorId: true,
            assigneeId: true,
            projectId: true,
          },
        },
      },
    });

    if (!reminder) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      reminder.userId === userId ||
      reminder.task.creatorId === userId ||
      reminder.task.assigneeId === userId ||
      (reminder.task.projectId && await this.isProjectMember(userId, reminder.task.projectId));

    if (!hasAccess) {
      return null;
    }

    return prisma.reminder.update({
      where: { id },
      data: updateData,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            deadline: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  static async deleteReminder(id: string, userId: string) {
    const reminder = await prisma.reminder.findUnique({
      where: { id },
      select: { 
        id: true, 
        userId: true, 
        taskId: true,
        task: {
          select: {
            creatorId: true,
            assigneeId: true,
            projectId: true,
          },
        },
      },
    });

    if (!reminder) {
      return null;
    }

    // Перевіряємо права доступу
    const hasAccess = 
      reminder.userId === userId ||
      reminder.task.creatorId === userId ||
      reminder.task.assigneeId === userId ||
      (reminder.task.projectId && await this.isProjectMember(userId, reminder.task.projectId));

    if (!hasAccess) {
      return null;
    }

    return prisma.reminder.delete({
      where: { id },
    });
  }

  static async getPendingReminders() {
    const now = new Date();
    
    return prisma.reminder.findMany({
      where: {
        remindAt: { lte: now },
        isSent: false,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            deadline: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { remindAt: 'asc' },
    });
  }

  static async markReminderAsSent(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: { isSent: true },
    });
  }

  static async sendPushNotification(reminder: any) {
    try {
      // Тут має бути логіка відправки push-сповіщення через Firebase
      // Поки що просто логуємо
      console.log(`Sending push notification for reminder ${reminder.id} to user ${reminder.user.email}`);
      
      // Позначаємо нагадування як відправлене
      await this.markReminderAsSent(reminder.id);
      
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  static async processReminders() {
    const pendingReminders = await this.getPendingReminders();
    
    for (const reminder of pendingReminders) {
      if (reminder.type === ReminderType.PUSH) {
        await this.sendPushNotification(reminder);
      }
      // Тут можна додати логіку для email нагадувань
    }
  }

  static async getUpcomingReminders(userId: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return prisma.reminder.findMany({
      where: {
        userId,
        remindAt: { gte: now, lte: futureDate },
        isSent: false,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            deadline: true,
            status: true,
          },
        },
      },
      orderBy: { remindAt: 'asc' },
    });
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
