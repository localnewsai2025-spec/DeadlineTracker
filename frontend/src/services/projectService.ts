import { apiClient } from '../utils/api';
import { Project, CreateProjectData, ProjectFilters, PaginationParams, PaginatedResponse } from '../types';

export const projectService = {
  // Отримати всі проєкти
  getProjects: async (filters?: ProjectFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Project>> => {
    const params = { ...filters, ...pagination };
    const response = await apiClient.get<{ data: PaginatedResponse<Project> }>('/projects', params);
    return response.data;
  },

  // Отримати проєкт за ID
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<{ data: Project }>(`/projects/${id}`);
    return response.data;
  },

  // Створити новий проєкт
  createProject: async (projectData: CreateProjectData): Promise<Project> => {
    const response = await apiClient.post<{ data: Project }>('/projects', projectData);
    return response.data;
  },

  // Оновити проєкт
  updateProject: async (id: string, projectData: Partial<CreateProjectData>): Promise<Project> => {
    const response = await apiClient.put<{ data: Project }>(`/projects/${id}`, projectData);
    return response.data;
  },

  // Видалити проєкт
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Отримати статистику проєкту
  getProjectStats: async (id: string): Promise<any> => {
    const response = await apiClient.get<{ data: any }>(`/projects/${id}/stats`);
    return response.data;
  },

  // Додати учасника до проєкту
  addProjectMember: async (projectId: string, userId: string, role: string = 'member'): Promise<any> => {
    const response = await apiClient.post<{ data: any }>(`/projects/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  // Видалити учасника з проєкту
  removeProjectMember: async (projectId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  },

  // Оновити роль учасника проєкту
  updateProjectMemberRole: async (projectId: string, userId: string, role: string): Promise<any> => {
    const response = await apiClient.put<{ data: any }>(`/projects/${projectId}/members/${userId}/role`, {
      role,
    });
    return response.data;
  },
};
