import { ZodError } from 'zod';
import {
  ErrorResponse,
  PaginationResponse,
  SuccessResponse,
  ValidationError,
} from '../types/api-reponse.types';

export class ResponseUtils {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
  ): SuccessResponse<T> {
    return {
      data,
      success: true,
      message,
    };
  }

  static error(
    message: string,
    errors?: ValidationError[] | string[],
  ): ErrorResponse {
    return {
      data: null,
      success: false,
      message,
      errors,
    };
  }

  static validationError(
    zodError: ZodError,
    message: string = 'Validation failed',
  ): ErrorResponse {
    const errors: ValidationError[] = zodError.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return this.error(message, errors);
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message: string = 'Data retrieved successfully',
  ): PaginationResponse<T> {
    const validPageSize = pageSize <= 0 ? 1 : pageSize;

    const totalPages = total === 0 ? 0 : Math.ceil(total / validPageSize);

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      success: true,
      message,
      pagination: {
        total,
        page,
        pageSize: validPageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
