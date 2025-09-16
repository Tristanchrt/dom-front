import { ProfilesRepository } from '@domain/usecases/profile/ProfilesUseCases';
import { CreatorProfile } from '@domain/models/Profile';
import { LocalStore } from '@data/storage/LocalStore';
import { creatorProfiles } from '@data/fixtures/creators';

const KEY = 'profiles';

export class LocalProfilesRepository implements ProfilesRepository {
  async list(): Promise<CreatorProfile[]> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    if (list.length > 0) return list;
    // fallback to fixtures converted to domain model
    return Object.values(creatorProfiles).map((p: any) => ({
      id: p.id,
      name: p.name,
      handle: p.handle,
      avatar: p.avatar,
      coverImage: p.coverImage,
      followersCount: parseFixtureCount(p.followers),
      followingCount: parseFixtureCount(p.following),
      postsCount: typeof p.postsCount === 'string' ? parseFixtureCount(p.postsCount) : p.postsCount,
      verified: !!p.verified,
      category: p.category,
      bio: p.bio,
      location: p.location,
      joinDate: p.joinDate,
    }));
  }
  async getById(id: string): Promise<CreatorProfile | null> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    const fromStore = list.find((p) => p.id === id) ?? null;
    if (fromStore) return fromStore;
    const fallback = creatorProfiles[id as keyof typeof creatorProfiles];
    if (!fallback) return null;
    // Convert fixture counts to numbers (followersCount, followingCount)
    const followersCount = parseFixtureCount(fallback.followers);
    const followingCount = parseFixtureCount(fallback.following);
    return {
      id: fallback.id,
      name: fallback.name,
      handle: fallback.handle,
      avatar: fallback.avatar,
      coverImage: fallback.coverImage,
      followersCount,
      followingCount,
      postsCount:
        typeof fallback.postsCount === 'string'
          ? parseFixtureCount(fallback.postsCount)
          : fallback.postsCount,
      verified: !!fallback.verified,
      category: fallback.category,
      bio: fallback.bio,
      location: fallback.location,
      joinDate: fallback.joinDate,
    };
  }
  async follow(id: string): Promise<void> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    LocalStore.setJSON(
      KEY,
      list.map((p) => (p.id === id ? { ...p, followersCount: p.followersCount + 1 } : p)),
    );
  }
  async unfollow(id: string): Promise<void> {
    const list = LocalStore.getJSON<CreatorProfile[]>(KEY, []);
    LocalStore.setJSON(
      KEY,
      list.map((p) =>
        p.id === id ? { ...p, followersCount: Math.max(0, p.followersCount - 1) } : p,
      ),
    );
  }
}

function parseFixtureCount(val: string | number | undefined): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const trimmed = String(val).trim().toLowerCase();
  if (trimmed.endsWith('k')) {
    const n = parseFloat(trimmed.replace('k', ''));
    return Math.round(n * 1000);
  }
  return parseInt(trimmed.replace(/[^0-9]/g, ''), 10) || 0;
}
