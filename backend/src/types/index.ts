import { UserRole, TaskStatus, TaskPriority, ReminderType, ProjectStatus } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  deadline: Date;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  parentTaskId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateReminderData {
  taskId: string;
  remindAt: Date;
  type?: ReminderType;
}

export interface CreateCommentData {
  taskId: string;
  content: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  deadlineFrom?: Date;
  deadlineTo?: Date;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  creatorId?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export interface PushNotificationData {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export {
  UserRole,
  TaskStatus,
  TaskPriority,
  ReminderType,
  ProjectStatus
};
