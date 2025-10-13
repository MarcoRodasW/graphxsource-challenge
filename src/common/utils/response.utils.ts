import { ZodError } from 'zod';
import {
  ErrorResponse,
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
}
