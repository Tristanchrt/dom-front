import { PostsUseCases } from '@/domain/usecases/post/PostsUseCases';
import { LocalPostsRepository } from '@/data/repositories/LocalPostsRepository.impl';
import { ProfilesUseCases } from '@/domain/usecases/profile/ProfilesUseCases';
import { LocalProfilesRepository } from '@/data/repositories/LocalProfilesRepository.impl';
import { MessagingUseCases } from '@/domain/usecases/messaging/MessagingUseCases';
import { LocalMessagingRepository } from '@/data/repositories/LocalMessagingRepository.impl';

export const postsUseCases = new PostsUseCases(new LocalPostsRepository());
export const profilesUseCases = new ProfilesUseCases(new LocalProfilesRepository());
export const messagingUseCases = new MessagingUseCases(new LocalMessagingRepository());


