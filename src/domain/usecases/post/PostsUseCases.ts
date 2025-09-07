import { Post } from '../../models/Post';

export interface PostsRepository {
  list(): Promise<Post[]>;
  getById(id: string): Promise<Post | null>;
  like(id: string): Promise<void>;
  unlike(id: string): Promise<void>;
}

export class PostsUseCases {
  constructor(private repo: PostsRepository) {}

  async list(): Promise<Post[]> { return this.repo.list(); }
  async getById(id: string): Promise<Post | null> { return this.repo.getById(id); }
  async toggleLike(id: string, liked: boolean): Promise<void> {
    return liked ? this.repo.unlike(id) : this.repo.like(id);
  }
}


