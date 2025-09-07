export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  specialty?: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}
