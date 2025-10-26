import {
  CreateOrder,
  GetOrdersQuery,
  Order,
  UpdateOrder,
  UpdateOrderStatus,
} from '../interface/dtos/orders.dto';
import { OrderStatusHistory } from '../interface/dtos/order-status-history.dto';
import { PaginationResponse } from 'src/common/types/api-reponse.types';

export interface IOrdersRepository {
  createOrder(data: CreateOrder): Promise<Order>;
  getOrders(query: GetOrdersQuery): Promise<PaginationResponse<Order>>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrder(id: string, data: UpdateOrder): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  changeOrderStatus(
    id: string,
    changeStatusPayload: UpdateOrderStatus,
  ): Promise<Order>;
  getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]>;
}

export const ORDERS_REPOSITORY = Symbol('IOrdersRepository');
