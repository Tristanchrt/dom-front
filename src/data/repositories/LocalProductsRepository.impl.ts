import { ProductsRepository } from '@domain/usecases/product/ProductsUseCases';
import { Product } from '@domain/models/Product';
import { LocalStore } from '@data/storage/LocalStore';
import { productDetails } from '@data/fixtures/products';

const KEY = 'products';

export class LocalProductsRepository implements ProductsRepository {
  async list(): Promise<Product[]> {
    return LocalStore.getJSON<Product[]>(KEY, []);
  }
  async getById(id: string): Promise<Product | null> {
    const list = await this.list();
    const fromStore = list.find((p) => p.id === id) ?? null;
    if (fromStore) return fromStore;
    const fallback = productDetails[id as keyof typeof productDetails];
    if (!fallback) return null;
    // Map fixture to domain Product minimal shape
    return {
      id: fallback.id,
      name: fallback.name,
      description: fallback.description,
      priceCents: parsePriceCents(fallback.price),
      originalPriceCents: fallback.originalPrice
        ? parsePriceCents(fallback.originalPrice)
        : undefined,
      currency: 'EUR',
      imageUrls: [fallback.image],
      sellerName: fallback.seller,
      category: fallback.category,
      rating: fallback.rating,
      sales: fallback.sales,
      options: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

function parsePriceCents(label: string): number {
  // e.g., '30,80€' or '45,00€'
  const cleaned = label.replace(/[^0-9,\.]/g, '').replace(',', '.');
  const euros = parseFloat(cleaned);
  return Math.round((isNaN(euros) ? 0 : euros) * 100);
}
