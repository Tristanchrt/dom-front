import { LocalProfilesRepository } from '@/data/repositories/LocalProfilesRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';
import { CreatorProfile } from '@/domain/models/Profile';

const seed = (profiles: CreatorProfile[]) => LocalStore.setJSON('profiles', profiles);

describe('LocalProfilesRepository', () => {
  it('follow/unfollow adjusts followersCount', async () => {
    const profiles: CreatorProfile[] = [
      {
        id: 'c1',
        name: 'A',
        handle: '@a',
        followersCount: 1,
        followingCount: 0,
        postsCount: 0,
        verified: false,
      },
    ];
    seed(profiles);
    const repo = new LocalProfilesRepository();
    await repo.follow('c1');
    expect((await repo.getById('c1'))?.followersCount).toBe(2);
    await repo.unfollow('c1');
    expect((await repo.getById('c1'))?.followersCount).toBe(1);
  });
});
