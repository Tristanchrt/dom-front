export type OrderStatus = 'Paid' | 'Pending' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceCents: number;
  currency: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalCents: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
}


