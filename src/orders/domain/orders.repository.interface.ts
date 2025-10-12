import { CreateOrder, Order } from '../interface/dtos/orders.dto';

export interface IOrdersRepository {
  createOrder(data: CreateOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
}

export const ORDERS_REPOSITORY = Symbol('IOrdersRepository');
