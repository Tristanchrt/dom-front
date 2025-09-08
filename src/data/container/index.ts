import { PostsUseCases } from '@/domain/usecases/post/PostsUseCases';
import { LocalPostsRepository } from '@/data/repositories/LocalPostsRepository.impl';
import { ProfilesUseCases } from '@/domain/usecases/profile/ProfilesUseCases';
import { LocalProfilesRepository } from '@/data/repositories/LocalProfilesRepository.impl';
import { MessagingUseCases } from '@/domain/usecases/messaging/MessagingUseCases';
import { LocalMessagingRepository } from '@/data/repositories/LocalMessagingRepository.impl';
import { ProductsUseCases } from '@/domain/usecases/product/ProductsUseCases';
import { LocalProductsRepository } from '@/data/repositories/LocalProductsRepository.impl';
import { OrdersUseCases } from '@/domain/usecases/order/OrdersUseCases';
import { LocalOrdersRepository } from '@/data/repositories/LocalOrdersRepository.impl';
import { SellerProductsUseCases } from '@/domain/usecases/product/SellerProductsUseCases';
import { LocalSellerProductsRepository } from '@/data/repositories/LocalSellerProductsRepository.impl';
import { UsersUseCases } from '@/domain/usecases/user/UsersUseCases';
import { LocalUsersRepository } from '@/data/repositories/LocalUsersRepository.impl';

export const postsUseCases = new PostsUseCases(new LocalPostsRepository());
export const profilesUseCases = new ProfilesUseCases(new LocalProfilesRepository());
export const messagingUseCases = new MessagingUseCases(new LocalMessagingRepository());
export const productsUseCases = new ProductsUseCases(new LocalProductsRepository());
export const ordersUseCases = new OrdersUseCases(new LocalOrdersRepository());
export const sellerProductsUseCases = new SellerProductsUseCases(
  new LocalSellerProductsRepository(),
);
export const usersUseCases = new UsersUseCases(new LocalUsersRepository());
