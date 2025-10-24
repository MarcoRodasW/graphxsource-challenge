import {
  Logger,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ErrorResponse, ValidationError } from '../types/api-reponse.types';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = this.buildErrorResponse(exception);

    this.logger.error(
      `${exception.constructor.name}: ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private buildErrorResponse(exception: HttpException): ErrorResponse {
    if (exception instanceof ZodValidationException) {
      return this.handleValidationError(exception);
    }

    if (exception instanceof BadRequestException) {
      return this.handleBadRequest(exception);
    }

    if (exception instanceof NotFoundException) {
      return this.handleNotFound(exception);
    }

    if (exception instanceof ForbiddenException) {
      return this.handleForbidden(exception);
    }

    return this.handleGenericError(exception);
  }

  private handleValidationError(
    exception: ZodValidationException,
  ): ErrorResponse {
    const zodError = exception.getZodError();
    const errors: ValidationError[] =
      zodError instanceof ZodError
        ? zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          }))
        : [];

    return {
      data: null,
      success: false,
      message: 'Validation failed',
      errors,
    };
  }

  private handleBadRequest(exception: BadRequestException): ErrorResponse {
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
        ? exceptionResponse.message
        : 'Bad request';

    return {
      data: null,
      success: false,
      message,
    };
  }

  private handleNotFound(exception: NotFoundException): ErrorResponse {
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
        ? exceptionResponse.message
        : 'Resource not found';

    return {
      data: null,
      success: false,
      message,
    };
  }

  private handleForbidden(exception: ForbiddenException): ErrorResponse {
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
        ? exceptionResponse.message
        : 'Forbidden';

    return {
      data: null,
      success: false,
      message,
    };
  }

  private handleGenericError(exception: HttpException): ErrorResponse {
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
        ? exceptionResponse.message
        : exception.message || 'Internal server error';

    return {
      data: null,
      success: false,
      message,
    };
  }
}
