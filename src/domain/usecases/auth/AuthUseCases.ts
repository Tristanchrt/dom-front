import { User, CreateUserRequest } from '../../models/User';

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  register(request: CreateUserRequest): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class AuthUseCases {
  constructor(private authRepository: AuthRepository) {}

  async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return this.authRepository.login(email, password);
  }

  async register(request: CreateUserRequest): Promise<User> {
    if (!request.name || !request.email) {
      throw new Error('Name and email are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    if (request.name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    return this.authRepository.register(request);
  }

  async logout(): Promise<void> {
    return this.authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
