export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
  errors?: ValidationError[] | string[];
}

export interface SuccessResponse<T> extends ApiResponse<T> {
  data: T;
  success: true;
  message: string;
  errors?: never;
}

export interface ErrorResponse extends ApiResponse<null> {
  data: null;
  success: false;
  message: string;
  errors?: ValidationError[] | string[];
}

export type ControllerResponse<T> = Promise<T>;

export type ExplicitResponse<T> = ApiResponse<T>;

export type ListResponse<T> = SuccessResponse<T[]>;
