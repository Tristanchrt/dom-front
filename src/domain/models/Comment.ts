import { User } from './User';

export interface Comment {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  content: string;
  likesCount: number;
  createdAt: Date;
}


