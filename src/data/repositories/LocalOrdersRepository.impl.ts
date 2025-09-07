import { OrdersRepository } from '@domain/usecases/order/OrdersUseCases';
import { Order } from '@domain/models/Order';
import { LocalStore } from '@data/storage/LocalStore';

const KEY = 'orders';

export class LocalOrdersRepository implements OrdersRepository {
  async list(): Promise<Order[]> {
    return LocalStore.getJSON<Order[]>(KEY, []);
  }
  async getById(id: string): Promise<Order | null> {
    const list = await this.list();
    return list.find(o => o.id === id) ?? null;
  }
}


