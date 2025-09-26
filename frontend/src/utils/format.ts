import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'dd.MM.yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: uk });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: uk });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: uk });
};

export const formatSmartDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Сьогодні, ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Завтра, ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Вчора, ${format(dateObj, 'HH:mm')}`;
  }
  
  return formatDateTime(dateObj);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б';
  
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

export const formatTaskStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    NOT_STARTED: 'Не розпочато',
    IN_PROGRESS: 'У процесі',
    COMPLETED: 'Виконано',
    OVERDUE: 'Прострочено',
  };
  
  return statusMap[status] || status;
};

export const formatTaskPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    LOW: 'Низький',
    MEDIUM: 'Середній',
    HIGH: 'Високий',
    URGENT: 'Терміновий',
  };
  
  return priorityMap[priority] || priority;
};

export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    STUDENT: 'Студент',
    PROJECT_LEAD: 'Керівник проєкту',
    ADMIN: 'Адміністратор',
    SUPER_ADMIN: 'Супер-адміністратор',
  };
  
  return roleMap[role] || role;
};

export const formatProjectStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Активний',
    ARCHIVED: 'Архівний',
    COMPLETED: 'Завершений',
  };
  
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    NOT_STARTED: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  
  return colorMap[priority] || 'bg-gray-100 text-gray-800';
};

export const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    STUDENT: 'bg-blue-100 text-blue-800',
    PROJECT_LEAD: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-orange-100 text-orange-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800',
  };
  
  return colorMap[role] || 'bg-gray-100 text-gray-800';
};
