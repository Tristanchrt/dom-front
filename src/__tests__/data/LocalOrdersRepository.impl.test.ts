import { LocalOrdersRepository } from '@/data/repositories/LocalOrdersRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';
import { Order } from '@/domain/models/Order';

const seed = (orders: Order[]) => LocalStore.setJSON('orders', orders);

describe('LocalOrdersRepository', () => {
  it('list/getById', async () => {
    const now = new Date();
    const orders: Order[] = [{
      id: 'o1', items: [], totalCents: 0, currency: 'EUR', status: 'Paid', createdAt: now
    }];
    seed(orders);
    const repo = new LocalOrdersRepository();
    expect((await repo.list()).length).toBe(1);
    expect((await repo.getById('o1'))?.id).toBe('o1');
  });
});


