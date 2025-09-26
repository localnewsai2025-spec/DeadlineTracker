import { apiClient } from '../utils/api';
import { Reminder, CreateReminderData } from '../types';

export const reminderService = {
  // Створити нагадування
  createReminder: async (reminderData: CreateReminderData): Promise<Reminder> => {
    const response = await apiClient.post<{ data: Reminder }>('/reminders', reminderData);
    return response.data;
  },

  // Отримати нагадування для завдання
  getRemindersByTask: async (taskId: string): Promise<Reminder[]> => {
    const response = await apiClient.get<{ data: Reminder[] }>(`/reminders/task/${taskId}`);
    return response.data;
  },

  // Оновити нагадування
  updateReminder: async (id: string, reminderData: Partial<CreateReminderData>): Promise<Reminder> => {
    const response = await apiClient.put<{ data: Reminder }>(`/reminders/${id}`, reminderData);
    return response.data;
  },

  // Видалити нагадування
  deleteReminder: async (id: string): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`);
  },

  // Отримати майбутні нагадування
  getUpcomingReminders: async (days: number = 7): Promise<Reminder[]> => {
    const response = await apiClient.get<{ data: Reminder[] }>('/reminders/upcoming', { days });
    return response.data;
  },
};
