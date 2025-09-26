import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Внутрішня помилка сервера';

  // Логування помилки
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Обробка різних типів помилок
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Помилка валідації даних';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Невірний формат даних';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Невірний токен доступу';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Токен доступу закінчився';
  } else if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Помилка бази даних';
  } else if (error.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Помилка валідації бази даних';
  }

  // Відправка відповіді
  ResponseUtils.error(res, message, statusCode, config.nodeEnv === 'development' ? error.stack : undefined);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  ResponseUtils.notFound(res, `Маршрут ${req.originalUrl} не знайдено`);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
