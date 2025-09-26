import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export class ResponseUtils {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 400, error?: string): void {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message?: string
  ): void {
    const response: PaginatedResponse<T> = {
      data,
      pagination,
    };
    res.status(200).json({
      success: true,
      data: response,
      message,
    });
  }

  static created<T>(res: Response, data: T, message?: string): void {
    this.success(res, data, message, 201);
  }

  static notFound(res: Response, message: string = 'Ресурс не знайдено'): void {
    this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Неавторизований доступ'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Доступ заборонено'): void {
    this.error(res, message, 403);
  }

  static badRequest(res: Response, message: string = 'Невірний запит'): void {
    this.error(res, message, 400);
  }

  static internalError(res: Response, message: string = 'Внутрішня помилка сервера'): void {
    this.error(res, message, 500);
  }
}
