import {
  CreateOrder,
  Order,
  OrderStatus,
  UpdateOrder,
} from '../interface/dtos/orders.dto';
import { OrderStatusHistory } from '../interface/dtos/order-status-history.dto';

export interface IOrdersRepository {
  createOrder(data: CreateOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrder(id: string, data: UpdateOrder): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  changeOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order>;
  getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]>;
}

export const ORDERS_REPOSITORY = Symbol('IOrdersRepository');
