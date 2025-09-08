export type OrderStatus = 'Paid' | 'Pending' | 'Cancelled';

export interface OrderItemSnapshot {
  productId?: string;
  productName: string;
  imageUrl?: string;
  unitPriceCents?: number; // optional if only label provided
  currency?: string; // e.g., 'EUR'
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  placedAt: Date;
  item: OrderItemSnapshot;
}
