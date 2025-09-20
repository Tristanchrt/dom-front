import { PostsRepository } from '@domain/usecases/post/PostsUseCases';
import { Post } from '@domain/models/Post';
import { LocalStore } from '@data/storage/LocalStore';
import { postDetails } from '@data/fixtures/posts';

const KEY = 'posts';

export class LocalPostsRepository implements PostsRepository {
  async list(): Promise<Post[]> {
    const existing = LocalStore.getJSON<Post[]>(KEY, []);
    if (existing && existing.length > 0) return existing;

    // Seed from fixtures on first load
    const seeded: Post[] = Object.values(postDetails).map((p: any) => {
      const now = new Date();
      return {
        id: String(p.id),
        content: String(p.content ?? ''),
        authorId: String(p.user?.id ?? `u_${p.id}`),
        author: {
          id: String(p.user?.id ?? `u_${p.id}`),
          name: String(p.user?.name ?? 'User'),
          email: `${(p.user?.handle ?? 'user').replace('@', '')}@example.com`,
          avatar: p.user?.avatar,
          username: p.user?.handle,
          createdAt: now,
          updatedAt: now,
        },
        imageUrls: p.image ? [String(p.image)] : undefined,
        likesCount: Number(p.likes ?? 0),
        commentsCount: Number(p.comments ?? 0),
        isLiked: false,
        createdAt: now,
        updatedAt: now,
      } as Post;
    });
    LocalStore.setJSON(KEY, seeded);
    return seeded;
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
