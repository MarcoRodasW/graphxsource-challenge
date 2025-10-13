import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateProductUseCase } from './application/use-cases/create-product';
import { PRODUCTS_REPOSITORY } from './domain/products.repository.interface';
import { ProductsRepository } from './infrastructure/repositories/products.repository';
import { ProductsController } from './interface/controller/products.controller';

@Module({
  providers: [
    PrismaService,
    CreateProductUseCase,
    { provide: PRODUCTS_REPOSITORY, useClass: ProductsRepository },
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
