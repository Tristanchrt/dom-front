import { AuthRepository } from '@domain/usecases/auth/AuthUseCases';
import { User, CreateUserRequest } from '@domain/models/User';
import { AuthApi } from '@data/api/auth.api';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authApi: AuthApi) {}

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.authApi.login({ email, password });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async register(request: CreateUserRequest): Promise<User> {
    try {
      const response = await this.authApi.register(request);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authApi.logout();
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      // If user is not authenticated, return null instead of throwing
      return null;
    }
  }

  private handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
