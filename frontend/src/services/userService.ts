import { apiClient } from '../utils/api';
import { User, UserFilters, PaginationParams, PaginatedResponse } from '../types';

export const userService = {
  // Отримати всіх користувачів (тільки для адміністраторів)
  getUsers: async (filters?: UserFilters, pagination?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const params = { ...filters, ...pagination };
    const response = await apiClient.get<{ data: PaginatedResponse<User> }>('/users', params);
    return response.data;
  },

  // Отримати користувача за ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(`/users/${id}`);
    return response.data;
  },

  // Оновити користувача
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<{ data: User }>(`/users/${id}`, userData);
    return response.data;
  },

  // Видалити користувача
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Змінити роль користувача
  changeUserRole: async (id: string, role: string): Promise<User> => {
    const response = await apiClient.put<{ data: User }>(`/users/${id}/role`, { role });
    return response.data;
  },

  // Отримати статистику користувача
  getUserStats: async (id: string): Promise<any> => {
    const response = await apiClient.get<{ data: any }>(`/users/${id}/stats`);
    return response.data;
  },
};
