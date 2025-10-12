import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
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
import { CreateOrderDTO, OrderDTO } from '../dtos/orders.dto';
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
}
