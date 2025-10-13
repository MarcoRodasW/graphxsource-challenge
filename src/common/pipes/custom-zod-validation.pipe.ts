/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ResponseUtils } from '../utils/response.utils';

const InternalZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const response = ResponseUtils.validationError(error);
    return new BadRequestException(response);
  },
});

@Injectable()
export class CustomZodValidationPipe implements PipeTransform {
  private readonly internalPipe = new InternalZodValidationPipe();

  transform(value: unknown, metadata: ArgumentMetadata) {
    return this.internalPipe.transform(value, metadata);
  }
}
