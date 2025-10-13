import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const OrderStatusEnumSchema = z.enum([
  'RECEIVED',
  'PROCESSING',
  'APPROVED',
  'IN_PRODUCTION',
  'SHIPPED',
  'DELIVERED',
]);

export const OrderStatusHistoryDTOSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  fromStatus: OrderStatusEnumSchema.nullable(),
  toStatus: OrderStatusEnumSchema,
});

// Zod Parser to OpenAPI standard
export class OrderStatusHistoryDTO extends createZodDto(
  OrderStatusHistoryDTOSchema,
) {}

// Zod Types
export type OrderStatusHistory = z.infer<typeof OrderStatusHistoryDTOSchema>;
