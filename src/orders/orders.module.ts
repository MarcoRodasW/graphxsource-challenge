import { Module } from '@nestjs/common';
import { OrdersController } from './interface/controllers/orders.controller';
import { ORDERS_REPOSITORY } from './domain/orders.repository.interface';
import { OrdersRepository } from './infrastructure/repositories/orders.repository';
import { ChangeOrderStatusUseCase } from './application/use-cases/change-order-status';
import { ValidateOrderUpdateUseCase } from './application/use-cases/validate-order-update';
import { CommonModule } from 'src/common/common.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderIdGeneratorService } from './application/services/order-id-generator.service';

@Module({
  imports: [CommonModule, ProductsModule],
  controllers: [OrdersController],
  providers: [
    ChangeOrderStatusUseCase,
    ValidateOrderUpdateUseCase,
    OrderIdGeneratorService,
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersRepository,
    },
  ],
})
export class OrdersModule {}
