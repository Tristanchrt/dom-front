import { Order } from '../../models/Order';

export interface OrdersRepository {
  list(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
}

export class OrdersUseCases {
  constructor(private repo: OrdersRepository) {}
  list(): Promise<Order[]> { return this.repo.list(); }
  getById(id: string): Promise<Order | null> { return this.repo.getById(id); }
}


