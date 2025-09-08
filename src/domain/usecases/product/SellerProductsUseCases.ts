export interface SellerProductSummary {
  id: string;
  name: string;
  priceLabel: string;
  status: 'Active' | 'Draft';
  imageUrl: string;
  sales: number;
  views: number;
}

export interface SellerProductsRepository {
  listMine(): Promise<SellerProductSummary[]>;
}

export class SellerProductsUseCases {
  constructor(private repo: SellerProductsRepository) {}
  listMine(): Promise<SellerProductSummary[]> {
    return this.repo.listMine();
  }
}
