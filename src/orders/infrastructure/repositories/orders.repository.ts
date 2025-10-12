import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { IOrdersRepository } from 'src/orders/domain/orders.repository.interface';
import { CreateOrder, Order } from 'src/orders/interface/dtos/orders.dto';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
