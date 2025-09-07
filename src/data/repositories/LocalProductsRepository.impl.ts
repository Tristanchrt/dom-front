import { ProductsRepository } from '@domain/usecases/product/ProductsUseCases';
import { Product } from '@domain/models/Product';
import { LocalStore } from '@data/storage/LocalStore';

const KEY = 'products';

export class LocalProductsRepository implements ProductsRepository {
  async list(): Promise<Product[]> {
    return LocalStore.getJSON<Product[]>(KEY, []);
  }
  async getById(id: string): Promise<Product | null> {
    const list = await this.list();
    return list.find(p => p.id === id) ?? null;
  }
}


