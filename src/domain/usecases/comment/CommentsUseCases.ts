import { Comment } from '../../models/Comment';
import { User } from '../../models/User';

export interface CommentsRepository {
  list(postId: string): Promise<Comment[]>;
  add(
    postId: string,
    content: string,
    replyTo?: Pick<User, 'id' | 'name'>,
    parentCommentId?: string,
  ): Promise<Comment>;
}

export class CommentsUseCases {
  constructor(private repo: CommentsRepository) {}

  async list(postId: string): Promise<Comment[]> {
    return this.repo.list(postId);
  }

  async add(
    postId: string,
    content: string,
    replyTo?: Pick<User, 'id' | 'name'>,
    parentCommentId?: string,
  ): Promise<Comment> {
    return this.repo.add(postId, content, replyTo, parentCommentId);
  }
}
