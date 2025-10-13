import {
  CreateProduct,
  Product,
  ProductsQueryParams,
} from '../interface/dto/products.dto';

export interface IProductsRepository {
  createProduct(data: CreateProduct): Promise<Product>;
  getProducts(query: ProductsQueryParams): Promise<Product[]>;
}

export const PRODUCTS_REPOSITORY = Symbol('IProductsRepository');
