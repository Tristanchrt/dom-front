import { UsersRepository } from '@/domain/usecases/user/UsersUseCases';
import { UserProfileDraft } from '@/domain/models/UserProfile';
import { LocalStore } from '@/data/storage/LocalStore';
import { profileEditDefaults } from '@/data/fixtures/settings';

const KEY = 'user.profileDraft';

export class LocalUsersRepository implements UsersRepository {
  async getProfileDraft(): Promise<UserProfileDraft | null> {
    const stored = LocalStore.getJSON<UserProfileDraft | null>(KEY, null);
    return stored ?? profileEditDefaults;
  }
  async saveProfileDraft(draft: UserProfileDraft): Promise<void> {
    LocalStore.setJSON(KEY, draft);
  }
}


