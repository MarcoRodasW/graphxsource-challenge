import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { IOrdersRepository } from 'src/orders/domain/orders.repository.interface';
import {
  CreateOrder,
  Order,
  OrderStatus,
  UpdateOrder,
} from 'src/orders/interface/dtos/orders.dto';
import type { OrderStatusHistory } from 'src/orders/interface/dtos/order-status-history.dto';
import { ChangeOrderStatusUseCase } from 'src/orders/application/use-cases/change-order-status';
import { ValidateOrderUpdateUseCase } from 'src/orders/application/use-cases/validate-order-update';
import type { IProductsRepository } from 'src/products/domain/products.repository.interface';
import { PRODUCTS_REPOSITORY } from 'src/products/domain/products.repository.interface';
import { OrderIdGeneratorService } from 'src/orders/application/services/order-id-generator.service';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase,
    private readonly validateOrderUpdateUseCase: ValidateOrderUpdateUseCase,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: IProductsRepository,
    private readonly orderIdGenerator: OrderIdGeneratorService,
  ) {}

  async createOrder(data: CreateOrder): Promise<Order> {
    // Validate product exists
    await this.productsRepository.getProductById(data.productId);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        // Generate correlative order ID
        const orderId = await this.orderIdGenerator.generateOrderId();

        // Create order with initial history record in transaction
        return await this.prisma.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              ...data,
              orderId,
            },
          });

          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              fromStatus: null,
              toStatus: order.orderStatus,
            },
          });

          return order;
        });
      } catch (error: unknown) {
        // Handle unique constraint violation (race condition)
        const isPrismaError =
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 'P2002';

        if (isPrismaError && attempt < maxRetries - 1) {
          attempt++;
          continue; // Retry with new ID
        }
        throw error;
      }
    }

    throw new Error(
      'Failed to generate unique order ID after multiple attempts',
    );
  }

  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async updateOrder(id: string, data: UpdateOrder): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.validateOrderUpdateUseCase.validate(order.orderStatus as OrderStatus);

    return this.prisma.order.update({
      where: { id: order.id },
      data,
    });
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.prisma.order.delete({
      where: { id: order.id },
    });
  }

  async changeOrderStatus(
    id: string,
    orderStatus: OrderStatus,
  ): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.changeOrderStatusUseCase.validateTransition(
      order.orderStatus as OrderStatus,
      orderStatus,
    );

    return await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { orderStatus },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: order.orderStatus,
          toStatus: orderStatus,
        },
      });

      return updatedOrder;
    });
  }

  async getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'asc' },
    });
  }
}
