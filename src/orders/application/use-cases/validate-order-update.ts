import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderStatus } from 'src/orders/interface/dtos/orders.dto';

@Injectable()
export class ValidateOrderUpdateUseCase {
  private readonly lockedStatuses: OrderStatus[] = [
    OrderStatus.APPROVED,
    OrderStatus.IN_PRODUCTION,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
  ];

  validate(currentStatus: OrderStatus | string): void {
    const status = currentStatus as OrderStatus;
    if (this.lockedStatuses.includes(status)) {
      throw new BadRequestException(
        'No se puede actualizar la orden en su estado actual',
      );
    }
  }
}
