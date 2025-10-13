import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderStatus } from 'src/orders/interface/dtos/orders.dto';

type ValidTransitions = Record<OrderStatus, OrderStatus[]>;

@Injectable()
export class ChangeOrderStatusUseCase {
  private readonly validTransitions: ValidTransitions = {
    [OrderStatus.RECEIVED]: [OrderStatus.PROCESSING, OrderStatus.APPROVED],
    [OrderStatus.PROCESSING]: [OrderStatus.APPROVED],
    [OrderStatus.APPROVED]: [OrderStatus.PROCESSING, OrderStatus.IN_PRODUCTION],
    [OrderStatus.IN_PRODUCTION]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
  };
  canTransition(current: OrderStatus, next: OrderStatus): boolean {
    const allowed = this.validTransitions[current] || [];
    return allowed.includes(next);
  }

  validateTransition(current: OrderStatus, next: OrderStatus): void {
    if (current === next) return;
    if (!this.canTransition(current, next)) {
      throw new BadRequestException(
        `Invalid order status transition from ${current} to ${next}`,
      );
    }
  }
}
