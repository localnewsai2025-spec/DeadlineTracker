export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  assigneeId?: string;
  projectId?: string;
  parentTaskId?: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
  parentTask?: {
    id: string;
    title: string;
  };
  subTasks?: Task[];
  comments?: Comment[];
  attachments?: Attachment[];
  reminders?: Reminder[];
  _count?: {
    comments: number;
    attachments: number;
    reminders: number;
    subTasks: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: ProjectMember[];
  tasks: Task[];
  _count: {
    tasks: number;
    members: number;
  };
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
  taskId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Reminder {
  id: string;
  taskId: string;
  userId: string;
  remindAt: string;
  type: ReminderType;
  isSent: boolean;
  createdAt: string;
  task: {
    id: string;
    title: string;
    deadline: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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

export interface CreateTaskData {
  title: string;
  description?: string;
  deadline: string;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  parentTaskId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  deadline?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateReminderData {
  taskId: string;
  remindAt: string;
  type?: ReminderType;
}

export interface CreateCommentData {
  taskId: string;
  content: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  creatorId?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export enum UserRole {
  STUDENT = 'STUDENT',
  PROJECT_LEAD = 'PROJECT_LEAD',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ReminderType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED',
}
