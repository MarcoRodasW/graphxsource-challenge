import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { IOrdersRepository } from 'src/orders/domain/orders.repository.interface';
import {
  CreateOrder,
  Order,
  OrderStatus,
  UpdateOrder,
} from 'src/orders/interface/dtos/orders.dto';
import { ChangeOrderStatusUseCase } from 'src/orders/application/use-cases/change-order-status';
import { ValidateOrderUpdateUseCase } from 'src/orders/application/use-cases/validate-order-update';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase,
    private readonly validateOrderUpdateUseCase: ValidateOrderUpdateUseCase,
  ) {}

  async createOrder(data: CreateOrder): Promise<Order> {
    return this.prisma.order.create({
      data,
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
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

    return this.prisma.order.update({
      where: { id: order.id },
      data: { orderStatus },
    });
  }
}
