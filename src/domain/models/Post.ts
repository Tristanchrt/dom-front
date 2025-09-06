import { User } from './User';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}
