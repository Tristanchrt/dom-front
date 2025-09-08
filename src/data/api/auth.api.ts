import { ApiResponse } from '@utils/types';
import { User, CreateUserRequest } from '@domain/models/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<User> {
  token: string;
}

export class AuthApi {
  private readonly baseUrl = 'https://api.example.com';

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async register(request: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  private async getToken(): Promise<string | null> {
    // In a real app, this would come from secure storage
    // For now, we'll just return null
    return null;
  }
}
