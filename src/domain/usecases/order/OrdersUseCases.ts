import { Order } from '@/domain/models/Order';

export interface OrdersRepository {
  list(): Promise<Order[]>;
}

export class OrdersUseCases {
  constructor(private repo: OrdersRepository) {}
  list(): Promise<Order[]> {
    return this.repo.list();
  }
}
