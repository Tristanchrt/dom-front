import { LocalProductsRepository } from '@/data/repositories/LocalProductsRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';
import { Product } from '@/domain/models/Product';

const seed = (products: Product[]) => LocalStore.setJSON('products', products);

describe('LocalProductsRepository', () => {
  it('list/getById', async () => {
    const now = new Date();
    const items: Product[] = [
      {
        id: 'p1',
        name: 'X',
        priceCents: 1000,
        currency: 'EUR',
        imageUrls: [],
        sellerName: 'S',
        createdAt: now,
        updatedAt: now,
      },
    ];
    seed(items);
    const repo = new LocalProductsRepository();
    const list = await repo.list();
    expect(list).toHaveLength(1);
    expect((await repo.getById('p1'))?.name).toBe('X');
  });
});
