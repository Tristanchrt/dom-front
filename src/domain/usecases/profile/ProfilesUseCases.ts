import { CreatorProfile } from '../../models/Profile';

export interface ProfilesRepository {
  list(): Promise<CreatorProfile[]>;
  getById(id: string): Promise<CreatorProfile | null>;
  follow(id: string): Promise<void>;
  unfollow(id: string): Promise<void>;
}

export class ProfilesUseCases {
  constructor(private repo: ProfilesRepository) {}
  list() {
    return this.repo.list();
  }
  getById(id: string) {
    return this.repo.getById(id);
  }
  toggleFollow(id: string, isFollowing: boolean) {
    return isFollowing ? this.repo.unfollow(id) : this.repo.follow(id);
  }
}
