import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateProduct } from 'src/products/interface/dto/products.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProduct) {
    return this.prisma.$transaction(async (tsx) => {
      const product = await tsx.products.create({
        data: {
          name: data.name,
          sku: data.sku,
          price: data.price,
          description: data.description,
          productType: data.productType,
        },
      });

      if (data.productType === 'TSHIRT' && data.tshirtDetails) {
        await tsx.tshirtDetails.create({
          data: {
            productId: product.id,
            ...data.tshirtDetails,
          },
        });
      } else if (data.productType === 'MUG' && data.mugDetails) {
        await tsx.mugDetails.create({
          data: {
            productId: product.id,
            ...data.mugDetails,
          },
        });
      } else if (data.productType === 'POSTER' && data.posterDetails) {
        await tsx.posterDetails.create({
          data: {
            productId: product.id,
            ...data.posterDetails,
          },
        });
      }

      return tsx.products.findUnique({
        where: { id: product.id },
        include: {
          tshirtDetails: true,
          mugDetails: true,
          posterDetails: true,
        },
      });
    });
  }
}
