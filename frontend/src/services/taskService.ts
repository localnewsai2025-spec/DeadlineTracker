import { apiClient } from '../utils/api';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, PaginationParams, PaginatedResponse } from '../types';

export const taskService = {
  // Отримати всі завдання
  getTasks: async (filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const params = { ...filters, ...pagination };
    const response = await apiClient.get<{ data: PaginatedResponse<Task> }>('/tasks', params);
    return response.data;
  },

  // Отримати завдання за ID
  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<{ data: Task }>(`/tasks/${id}`);
    return response.data;
  },

  // Створити нове завдання
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post<{ data: Task }>('/tasks', taskData);
    return response.data;
  },

  // Оновити завдання
  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    const response = await apiClient.put<{ data: Task }>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Видалити завдання
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // Оновити статус завдання
  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const response = await apiClient.patch<{ data: Task }>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Отримати прострочені завдання
  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<{ data: Task[] }>('/tasks/overdue');
    return response.data;
  },

  // Отримати майбутні завдання
  getUpcomingTasks: async (days: number = 7): Promise<Task[]> => {
    const response = await apiClient.get<{ data: Task[] }>('/tasks/upcoming', { days });
    return response.data;
  },

  // Отримати статистику завдань
  getTaskStats: async (): Promise<any> => {
    const response = await apiClient.get<{ data: any }>('/tasks/stats');
    return response.data;
  },
};
