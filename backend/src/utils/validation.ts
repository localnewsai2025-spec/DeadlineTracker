import { body, param, query, ValidationChain } from 'express-validator';
import { UserRole, TaskStatus, TaskPriority, ReminderType, ProjectStatus } from '../types';

export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Введіть коректний email'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ім\'я повинно містити від 2 до 50 символів'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Прізвище повинно містити від 2 до 50 символів'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль повинен містити мінімум 6 символів'),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Невірна роль користувача'),
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Введіть коректний email'),
  body('password')
    .notEmpty()
    .withMessage('Пароль обов\'язковий'),
];

export const validateCreateTask: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Назва завдання повинна містити від 1 до 200 символів'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Опис не може перевищувати 1000 символів'),
  body('deadline')
    .isISO8601()
    .withMessage('Введіть коректну дату дедлайну'),
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Невірний пріоритет'),
  body('assigneeId')
    .optional()
    .isUUID()
    .withMessage('Невірний ID виконавця'),
  body('projectId')
    .optional()
    .isUUID()
    .withMessage('Невірний ID проєкту'),
  body('parentTaskId')
    .optional()
    .isUUID()
    .withMessage('Невірний ID батьківського завдання'),
];

export const validateUpdateTask: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Назва завдання повинна містити від 1 до 200 символів'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Опис не може перевищувати 1000 символів'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Введіть коректну дату дедлайну'),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Невірний статус'),
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Невірний пріоритет'),
  body('assigneeId')
    .optional()
    .isUUID()
    .withMessage('Невірний ID виконавця'),
];

export const validateCreateProject: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Назва проєкту повинна містити від 1 до 100 символів'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Опис не може перевищувати 500 символів'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Введіть коректну дату початку'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Введіть коректну дату завершення'),
];

export const validateCreateReminder: ValidationChain[] = [
  body('taskId')
    .isUUID()
    .withMessage('Невірний ID завдання'),
  body('remindAt')
    .isISO8601()
    .withMessage('Введіть коректну дату нагадування'),
  body('type')
    .optional()
    .isIn(Object.values(ReminderType))
    .withMessage('Невірний тип нагадування'),
];

export const validateCreateComment: ValidationChain[] = [
  body('taskId')
    .isUUID()
    .withMessage('Невірний ID завдання'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Коментар повинен містити від 1 до 1000 символів'),
];

export const validateId: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('Невірний ID'),
];

export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Сторінка повинна бути позитивним числом'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Ліміт повинен бути від 1 до 100'),
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Поле сортування повинно бути рядком'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Порядок сортування повинен бути asc або desc'),
];
