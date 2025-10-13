import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export enum ProductType {
  TSHIRT = 'TSHIRT',
  MUG = 'MUG',
  POSTER = 'POSTER',
}

export const ProductTypeEnumSchema = z.enum(['TSHIRT', 'MUG', 'POSTER']);

export const TshirtDetailSchema = z.object({
  color: z
    .string()
    .min(1, {
      error: 'Es requerido ingresar un color.',
    })
    .max(50, {
      error: 'El color debe tener máximo 50 caracteres.',
    }),
  size: z
    .string()
    .min(1, {
      error: 'Es requerido ingresar un tamaño.',
    })
    .max(5, {
      error: 'El tamaño debe tener máximo 5 caracteres.',
    }),
});

export const MugDetailSchema = z.object({
  capacity: z
    .number()
    .min(10, { error: 'La capacidad mínima es de 10ml.' })
    .max(100, { error: 'La capacidad máxima es de 2000ml.' }),
  color: z
    .string()
    .min(1, 'Es requerido ingresar un color.')
    .max(50, 'El color debe tener máximo 50 caracteres.'),
});

export const PosterDetailSchema = z.object({
  width: z
    .number()
    .min(10, { error: 'El ancho mínimo es de 10cm.' })
    .max(200, { error: 'El ancho máximo es de 200cm.' }),
  height: z
    .number()
    .min(10, { error: 'El alto mínimo es de 10cm.' })
    .max(200, { error: 'El alto máximo es de 200cm.' }),
  material: z
    .string()
    .min(1, 'Es requerido ingresar un material.')
    .max(50, 'El material debe tener máximo 50 caracteres.'),
});

export const CreateProductDTOSchema = z.object({
  name: z
    .string({
      error: 'El nombre del producto es obligatorio',
    })
    .min(3, {
      error: 'El nombre del producto debe tener mínimo 3 caracteres',
    }),
  sku: z
    .string()
    .min(1, {
      error: 'El SKU del producto es obligatorio',
    })
    .max(10, {
      error: 'El SKU del producto debe tener máximo 10 caracteres',
    }),
  price: z.number().min(1, { error: 'El precio debe ser al menos 1' }),
  productType: ProductTypeEnumSchema,
  description: z
    .string()
    .max(255, {
      error: 'La descripción debe tener máximo 255 caracteres',
    })
    .nullable()
    .optional(),
  tshirtDetails: TshirtDetailSchema.nullable().optional(),
  mugDetails: MugDetailSchema.nullable().optional(),
  posterDetails: PosterDetailSchema.nullable().optional(),
});

export const ProductDTOSchema = CreateProductDTOSchema.extend({
  id: z.uuid(),
  tshirtDetails: TshirtDetailSchema.extend({
    id: z.int(),
  }).nullable(),
  mugDetails: MugDetailSchema.extend({
    id: z.int(),
  }).nullable(),
  posterDetails: PosterDetailSchema.extend({
    id: z.int(),
  }).nullable(),
});

export const ProductsQueryParamsSchema = z.object({
  productType: ProductTypeEnumSchema.optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
});

//Zod Parser to OpenAPI standard
export class CreateProductDTO extends createZodDto(CreateProductDTOSchema) {}
export class ProductDTO extends createZodDto(ProductDTOSchema) {}
export class ProductsQueryParamsDTO extends createZodDto(
  ProductsQueryParamsSchema,
) {}
//Zod Types
export type CreateProduct = z.infer<typeof CreateProductDTOSchema>;
export type Product = z.infer<typeof ProductDTOSchema>;
export type ProductsQueryParams = z.infer<typeof ProductsQueryParamsSchema>;
