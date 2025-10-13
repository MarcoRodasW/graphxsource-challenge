import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type IProductsRepository,
  PRODUCTS_REPOSITORY,
} from 'src/products/domain/products.repository.interface';
import {
  CreateProductDTO,
  ProductDTO,
  ProductsQueryParamsDTO,
} from '../dto/products.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: IProductsRepository,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Obtener lista de Productos',
    description:
      'Obtener una lista de productos, con la opción de filtrar por tipo de producto, nombre o SKU',
  })
  @ApiOkResponse({
    description: 'Lista de productos obtenida correctamente',
    type: ProductDTO,
    isArray: true,
  })
  getProducts(@Query() query: ProductsQueryParamsDTO) {
    return this.productsRepository.getProducts(query);
  }

  @Post('/')
  @ApiOperation({
    summary: 'Crear un nuevo Producto',
    description: 'Crear un nuevo producto con sus detalles específicos',
  })
  @ApiCreatedResponse({
    description: 'Producto creado correctamente',
    type: ProductDTO,
  })
  @ZodSerializerDto(ProductDTO)
  createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productsRepository.createProduct(createProductDTO);
  }
}
