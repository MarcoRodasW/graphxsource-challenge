import { createZodDto } from 'nestjs-zod';
import { ProductTypeEnumSchema } from 'src/products/interface/dto/products.dto';
import { z } from 'zod';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

const OrderStatusEnumSchema = z.enum([
  'RECEIVED',
  'PROCESSING',
  'APPROVED',
  'IN_PRODUCTION',
  'SHIPPED',
  'DELIVERED',
]);

export const CreateOrderDTOSchema = z.object({
  client: z
    .string({
      error: 'Nombre del cliente es obligatorio',
    })
    .min(5, {
      error: 'Nombre del cliente es obligatorio',
    })
    .max(100, {
      error: 'Nombre del cliente debe tener máximo 100 caracteres',
    }),
  productId: z.uuid({
    message: 'El ID del producto debe ser un UUID válido',
  }),
  orderStatus: OrderStatusEnumSchema.extract(['RECEIVED']).default('RECEIVED'),
  comments: z
    .string()
    .max(255, { error: 'Los comentarios deben tener máximo 255 caracteres' })
    .nullable()
    .optional(),
});

export const OrderDTOSchema = CreateOrderDTOSchema.extend({
  id: z.uuid(),
  orderId: z.string().regex(/^ORD-\d{8}-\d{4}$/, {
    message: 'Order ID must follow format ORD-YYYYMMDD-NNNN',
  }),
  orderStatus: OrderStatusEnumSchema,
});

export const UpdateOrderDTOSchema = z.object({
  client: z
    .string({
      error: 'Nombre del cliente es obligatorio',
    })
    .min(5, {
      error: 'Nombre del cliente es obligatorio',
    })
    .max(100, {
      error: 'Nombre del cliente debe tener máximo 100 caracteres',
    }),
  productId: z.uuid({
    message: 'El ID del producto debe ser un UUID válido',
  }),
  comments: z
    .string()
    .max(255, { error: 'Los comentarios deben tener máximo 255 caracteres' })
    .nullable()
    .optional(),
});

export const UpdateOrderStatusDTOSchema = z.object({
  orderStatus: OrderStatusEnumSchema,
  comments: z
    .string()
    .max(255, { error: 'Los comentarios deben tener máximo 255 caracteres' })
    .nullable(),
});

//Zod Parser to OpenAPI standard
export class CreateOrderDTO extends createZodDto(CreateOrderDTOSchema) {}
export class OrderDTO extends createZodDto(OrderDTOSchema) {}
export class UpdateOrderDTO extends createZodDto(UpdateOrderDTOSchema) {}
export class UpdateOrderStatusDTO extends createZodDto(
  UpdateOrderStatusDTOSchema,
) {}

//Zod Types
export const GetOrdersQueryDTOSchema = z.object({
  orderId: z.string().optional(),
  orderStatus: OrderStatusEnumSchema.optional(),
  productType: ProductTypeEnumSchema.optional(),
  client: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export class GetOrdersQueryDTO extends createZodDto(GetOrdersQueryDTOSchema) {}

export type CreateOrder = z.infer<typeof CreateOrderDTOSchema>;
export type Order = z.infer<typeof OrderDTOSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderDTOSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusDTOSchema>;
export type GetOrdersQuery = z.infer<typeof GetOrdersQueryDTOSchema>;
