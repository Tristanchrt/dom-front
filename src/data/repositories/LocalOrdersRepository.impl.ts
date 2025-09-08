import { OrdersRepository } from '@/domain/usecases/order/OrdersUseCases';
import { Order } from '@/domain/models/Order';
import { LocalStore } from '@/data/storage/LocalStore';
import { settingsOrders } from '@/data/fixtures/settings';

const KEY = 'orders';

export class LocalOrdersRepository implements OrdersRepository {
  async list(): Promise<Order[]> {
    const stored = await LocalStore.getJSON<Order[]>(KEY, []);
    if (stored && stored.length > 0) return stored;
    // map fixtures into domain order
    return settingsOrders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      status: o.status,
      placedAt: new Date(o.date),
      item: {
        productName: o.productName,
        imageUrl: o.image,
        quantity: o.quantity,
      },
    }));
  }
  async getById(id: string): Promise<Order | null> {
    const list = await this.list();
    return list.find((o) => o.id === id) ?? null;
  }
}
