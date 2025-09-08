import { LocalPostsRepository } from '@/data/repositories/LocalPostsRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';
import { Post } from '@/domain/models/Post';

const seed = (posts: Post[]) => LocalStore.setJSON('posts', posts);

describe('LocalPostsRepository', () => {
  it('list/getById/like/unlike', async () => {
    const now = new Date();
    const posts: Post[] = [
      {
        id: 'p1',
        content: 'hi',
        authorId: 'u1',
        author: {
          id: 'u1',
          name: 'A',
          email: 'a@a.com',
          isOnline: false,
          createdAt: now,
          updatedAt: now,
        },
        likesCount: 1,
        commentsCount: 0,
        isLiked: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
    seed(posts);
    const repo = new LocalPostsRepository();

    const listed = await repo.list();
    expect(listed).toHaveLength(1);

    const one = await repo.getById('p1');
    expect(one?.id).toBe('p1');

    await repo.like('p1');
    expect((await repo.getById('p1'))?.isLiked).toBe(true);

    await repo.unlike('p1');
    expect((await repo.getById('p1'))?.isLiked).toBe(false);
  });
});
