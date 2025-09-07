export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  originalPriceCents?: number;
  currency: string; // e.g., EUR
  imageUrls: string[];
  sellerName: string;
  category?: string;
  rating?: number;
  sales?: number;
  options?: ProductOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  priceCents: number;
  currency: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}


