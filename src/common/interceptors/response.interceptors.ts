import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtils } from '../utils/response.utils';
import { ApiResponse } from '../types/api-reponse.types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        if (this.isFormattedResponse(data)) {
          return data;
        }

        return ResponseUtils.success(data);
      }),
    );
  }

  private isFormattedResponse(data: unknown): data is ApiResponse<any> {
    if (data === null || typeof data !== 'object') {
      return false;
    }

    const obj = data as Record<string, unknown>;
    return (
      'success' in obj &&
      'data' in obj &&
      'message' in obj &&
      typeof obj.success === 'boolean'
    );
  }
}
