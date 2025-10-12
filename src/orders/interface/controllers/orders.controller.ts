import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type IOrdersRepository,
  ORDERS_REPOSITORY,
} from 'src/orders/domain/orders.repository.interface';
import {
  CreateOrderDTO,
  OrderDTO,
  OrderStatus,
  UpdateOrderDTO,
  UpdateOrderStatusDTO,
} from '../dtos/orders.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: IOrdersRepository,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Lista de todas las Ordenes',
    description:
      'Obtener una lista paginada de todas las ordenes con filtros opcionales',
  })
  @ApiOkResponse({
    description: 'Lista de ordenes obtenida correctamente',
    isArray: true,
    type: OrderDTO,
  })
  async getOrders() {
    return this.ordersRepository.getOrders();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Obtener una Orden por ID',
    description: 'Obtener los detalles de una orden específica por su ID',
  })
  @ApiOkResponse({
    description: 'Orden obtenida correctamente',
    type: OrderDTO,
  })
  async getOrderById(@Param('id') id: string) {
    return this.ordersRepository.getOrderById(id);
  }

  @Post('/')
  @ApiOperation({
    summary: 'Crear una nueva Orden',
    description: 'Crear una nueva orden con los datos proporcionados',
  })
  @ApiCreatedResponse({
    description: 'Orden creada correctamente',
    type: OrderDTO,
  })
  @ZodSerializerDto(OrderDTO)
  async createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    return this.ordersRepository.createOrder(createOrderDTO);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Actualizar una Orden por ID',
    description: 'Actualizar los detalles de una orden específica por su ID',
  })
  @ApiOkResponse({
    description: 'Orden actualizada correctamente',
    type: OrderDTO,
  })
  @ZodSerializerDto(OrderDTO)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ) {
    return this.ordersRepository.updateOrder(id, updateOrderDTO);
  }

  @Put('/changeStatus/:id')
  @ApiOperation({
    summary: 'Actualizar el estado de una Orden por ID',
    description: 'Actualizar el estado de una orden específica por su ID',
  })
  @ApiOkResponse({
    description: 'Estado de la orden actualizado correctamente',
    type: OrderDTO,
  })
  @ZodSerializerDto(OrderDTO)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO,
  ) {
    return this.ordersRepository.changeOrderStatus(
      id,
      updateOrderStatusDTO.orderStatus as OrderStatus,
    );
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar una Orden por ID',
    description: 'Eliminar una orden específica por su ID',
  })
  @ApiOkResponse({
    description: 'Orden eliminada correctamente',
  })
  async deleteOrder(@Param('id') id: string) {
    return this.ordersRepository.deleteOrder(id);
  }
}
