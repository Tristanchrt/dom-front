import { PostsRepository } from '@domain/usecases/post/PostsUseCases';
import { Post } from '@domain/models/Post';
import { LocalStore } from '@data/storage/LocalStore';

const KEY = 'posts';

export class LocalPostsRepository implements PostsRepository {
  async list(): Promise<Post[]> {
    return LocalStore.getJSON<Post[]>(KEY, []);
  }
  async getById(id: string): Promise<Post | null> {
    const list = await this.list();
    return list.find((p) => p.id === id) ?? null;
  }
  async like(id: string): Promise<void> {
    const list = await this.list();
    LocalStore.setJSON(
      KEY,
      list.map((p) => (p.id === id ? { ...p, isLiked: true, likesCount: p.likesCount + 1 } : p)),
    );
  }
  async unlike(id: string): Promise<void> {
    const list = await this.list();
    LocalStore.setJSON(
      KEY,
      list.map((p) =>
        p.id === id ? { ...p, isLiked: false, likesCount: Math.max(0, p.likesCount - 1) } : p,
      ),
    );
  }
}
