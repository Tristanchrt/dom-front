import {
  SellerProductsRepository,
  SellerProductSummary,
} from '@/domain/usecases/product/SellerProductsUseCases';
import { LocalStore } from '@/data/storage/LocalStore';
import { settingsSellerProducts } from '@/data/fixtures/settings';

const KEY = 'settings.sellerProducts';

export class LocalSellerProductsRepository implements SellerProductsRepository {
  async listMine(): Promise<SellerProductSummary[]> {
    const stored = await LocalStore.getJSON<SellerProductSummary[]>(KEY, []);
    if (stored && stored.length > 0) return stored;
    return settingsSellerProducts.map((p) => ({
      id: p.id,
      name: p.name,
      priceLabel: p.price,
      status: p.status,
      imageUrl: p.image,
      sales: p.sales,
      views: p.views,
    }));
  }
}
