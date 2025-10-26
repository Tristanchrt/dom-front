import { CommentsRepository } from '@domain/usecases/comment/CommentsUseCases';
import { Comment } from '@domain/models/Comment';
import { User } from '@domain/models/User';
import { LocalStore } from '@data/storage/LocalStore';
import { comments } from '@data/fixtures/comments';

const KEY = 'comments';

export class LocalCommentsRepository implements CommentsRepository {
  async list(postId: string): Promise<Comment[]> {
    const existing = LocalStore.getJSON<Comment[]>(`${KEY}_${postId}`, []);
    if (existing && existing.length > 0) return existing;

    // Seed from fixtures on first load
    const seeded: Comment[] = comments.map((c: any) => {
      return {
        ...c,
        createdAt: new Date(),
      } as Comment;
    });
    LocalStore.setJSON(`${KEY}_${postId}`, seeded);
    return seeded;
  }

  async add(
    postId: string,
    content: string,
    replyTo?: Pick<User, 'id' | 'name'>,
    parentCommentId?: string,
  ): Promise<Comment> {
    const list = await this.list(postId);
    const newComment: Comment = {
      id: new Date().getTime().toString(),
      content,
      createdAt: new Date(),
      likesCount: 0,
      user: {
        id: '1',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      },
      replyTo,
      parentCommentId,
    };
    const newList = [...list, newComment];
    LocalStore.setJSON(`${KEY}_${postId}`, newList);
    return newComment;
  }
}
