import { Order, OrderStatus } from 'generated/prisma';
import { WebhookEvent } from '../../../common/types/webhook.types';

interface OrderWebhookData {
  orderId: string;
  client: string;
  orderStatus: OrderStatus;
  productId: string;
  comments?: string;
}

export class OrderWebhookHelper {
  static shouldTriggerWebhook(status: OrderStatus): boolean {
    const triggerStatuses: OrderStatus[] = [
      'APPROVED',
      'IN_PRODUCTION',
      'SHIPPED',
      'DELIVERED',
    ];
    return triggerStatuses.includes(status);
  }

  static createOrderStatusEvent(
    order: Order,
    eventType: string,
  ): WebhookEvent<OrderWebhookData> {
    return {
      entityType: 'order',
      entityId: order.id,
      eventType,
      data: {
        orderId: order.orderId,
        client: order.client,
        orderStatus: order.orderStatus,
        productId: order.productId,
        comments: order.comments ?? undefined,
      },
      timestamp: new Date(),
    };
  }
}
