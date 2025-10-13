import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateProductUseCase } from 'src/products/application/use-cases/create-product';
import { IProductsRepository } from 'src/products/domain/products.repository.interface';
import {
  CreateProduct,
  Product,
  ProductsQueryParams,
} from 'src/products/interface/dto/products.dto';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}
  async createProduct(data: CreateProduct): Promise<Product> {
    if (data.productType === 'TSHIRT' && !data.tshirtDetails) {
      throw new BadRequestException(
        'Es obligatorio ingresar los detalles de la camiseta.',
      );
    }
    if (data.productType === 'MUG' && !data.mugDetails) {
      throw new BadRequestException(
        'Es obligatorio ingresar los detalles de la taza.',
      );
    }
    if (data.productType === 'POSTER' && !data.posterDetails) {
      throw new BadRequestException(
        'Es obligatorio ingresar los detalles del póster.',
      );
    }

    try {
      const product = await this.createProductUseCase.create(data);
      if (!product) {
        throw new BadRequestException('Error al crear el producto.');
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error ?? 'Error al crear el producto.');
    }
  }

  async getProducts(query: ProductsQueryParams): Promise<Product[]> {
    const { name, productType, sku } = query;

    const where: Prisma.ProductsWhereInput = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(productType && { productType }),
      ...(sku && { sku: { contains: sku, mode: 'insensitive' } }),
    };

    const products = await this.prisma.products.findMany({
      where,
      include: {
        tshirtDetails: true,
        mugDetails: true,
        posterDetails: true,
      },
    });

    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        tshirtDetails: true,
        mugDetails: true,
        posterDetails: true,
      },
    });

    if (!product) {
      throw new BadRequestException('Producto no encontrado.');
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new BadRequestException('Producto no encontrado.');
    }
    await this.prisma.products.delete({ where: { id: product.id } });
  }
}
