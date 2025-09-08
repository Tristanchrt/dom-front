import { LocalUsersRepository } from '@/data/repositories/LocalUsersRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';

describe('LocalUsersRepository', () => {
  it('gets defaults then persists draft', async () => {
    LocalStore.setJSON('user.profileDraft', null);
    const repo = new LocalUsersRepository();
    const first = await repo.getProfileDraft();
    expect(first?.name).toBeTruthy();
    await repo.saveProfileDraft({
      name: 'John Doe',
      status: 'online',
      description: 'desc',
      category: 'cat',
      socialLinks: 'links',
      avatarUrl: 'url',
    });
    const second = await repo.getProfileDraft();
    expect(second?.name).toBe('John Doe');
  });
});


