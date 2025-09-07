import { Product } from '../../models/Product';

export interface ProductsRepository {
  list(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}

export class ProductsUseCases {
  constructor(private repo: ProductsRepository) {}
  list(): Promise<Product[]> { return this.repo.list(); }
  getById(id: string): Promise<Product | null> { return this.repo.getById(id); }
}


