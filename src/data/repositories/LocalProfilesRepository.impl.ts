import { ProfilesRepository } from '@domain/usecases/profile/ProfilesUseCases';
import { CreatorProfile } from '@domain/models/Profile';
import { LocalStore } from '@data/storage/LocalStore';

const KEY = 'profiles';

export class LocalProfilesRepository implements ProfilesRepository {
  async getById(id: string): Promise<CreatorProfile | null> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    return list.find(p => p.id === id) ?? null;
  }
  async follow(id: string): Promise<void> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    LocalStore.setJSON(KEY, list.map(p => p.id === id ? { ...p, followersCount: p.followersCount + 1 } : p));
  }
  async unfollow(id: string): Promise<void> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    LocalStore.setJSON(KEY, list.map(p => p.id === id ? { ...p, followersCount: Math.max(0, p.followersCount - 1) } : p));
  }
}


