import { Module } from '@nestjs/common';
import { OrdersController } from './interface/controllers/orders.controller';
import { ORDERS_REPOSITORY } from './domain/orders.repository.interface';
import { OrdersRepository } from './infrastructure/repositories/orders.repository';
import { PrismaService } from 'src/common/services/prisma.service';
import { ChangeOrderStatusUseCase } from './application/use-cases/change-order-status';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    PrismaService,
    ChangeOrderStatusUseCase,
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersRepository,
    },
  ],
})
export class OrdersModule {}
