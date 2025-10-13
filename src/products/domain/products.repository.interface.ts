import {
  CreateProduct,
  Product,
  ProductsQueryParams,
} from '../interface/dto/products.dto';

export interface IProductsRepository {
  createProduct(data: CreateProduct): Promise<Product>;
  getProducts(query: ProductsQueryParams): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

export const PRODUCTS_REPOSITORY = Symbol('IProductsRepository');
