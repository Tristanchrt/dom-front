import { UserProfileDraft } from '@/domain/models/UserProfile';

export interface UsersRepository {
  getProfileDraft(): Promise<UserProfileDraft | null>;
  saveProfileDraft(draft: UserProfileDraft): Promise<void>;
}

export class UsersUseCases {
  constructor(private repo: UsersRepository) {}
  getProfileDraft() { return this.repo.getProfileDraft(); }
  saveProfileDraft(draft: UserProfileDraft) { return this.repo.saveProfileDraft(draft); }
}


