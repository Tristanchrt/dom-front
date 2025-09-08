import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from './useAuth';
import { useAuthStore } from '@store/auth.store';
import { User, CreateUserRequest } from '@domain/models/User';

// Mock the auth store
jest.mock('@store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the auth use cases
jest.mock('@domain/usecases/auth/AuthUseCases', () => ({
  AuthUseCases: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  })),
}));

// Mock the repository and API
jest.mock('@data/repositories/AuthRepository.impl');
jest.mock('@data/api/auth.api');

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  isOnline: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockAuthStore = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  setUser: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  logout: jest.fn(),
};

describe('useAuth', () => {
  beforeEach(() => {
    (useAuthStore as jest.MockedFunction<typeof useAuthStore>).mockReturnValue(mockAuthStore);
    jest.clearAllMocks();
  });

  it('should return auth state and actions', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.getCurrentUser).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.clearError();
    });

    expect(mockAuthStore.setError).toHaveBeenCalledWith(null);
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      // Mock successful login in AuthUseCases
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockResolvedValue(mockUser),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const user = await result.current.login('john@example.com', 'password');
        expect(user).toEqual(mockUser);
      });

      expect(mockAuthStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockAuthStore.setError).toHaveBeenCalledWith(null);
      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser);
      expect(mockAuthStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle login failure', async () => {
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Invalid credentials')),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.login('john@example.com', 'wrong-password');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Invalid credentials');
        }
      });

      expect(mockAuthStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockAuthStore.setError).toHaveBeenCalledWith('Invalid credentials');
      expect(mockAuthStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('register', () => {
    const registerRequest: CreateUserRequest = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    it('should handle successful registration', async () => {
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        register: jest.fn().mockResolvedValue(mockUser),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const user = await result.current.register(registerRequest);
        expect(user).toEqual(mockUser);
      });

      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle registration failure', async () => {
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        register: jest.fn().mockRejectedValue(new Error('Email already exists')),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.register(registerRequest);
        } catch (error) {
          expect((error as Error).message).toBe('Email already exists');
        }
      });

      expect(mockAuthStore.setError).toHaveBeenCalledWith('Email already exists');
    });
  });

  describe('logout', () => {
    it('should handle successful logout', async () => {
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        logout: jest.fn().mockResolvedValue(undefined),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockAuthStore.logout).toHaveBeenCalled();
    });

    it('should handle logout failure', async () => {
      const mockAuthUseCases = require('@domain/usecases/auth/AuthUseCases').AuthUseCases;
      mockAuthUseCases.mockImplementation(() => ({
        logout: jest.fn().mockRejectedValue(new Error('Logout failed')),
      }));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockAuthStore.setError).toHaveBeenCalledWith('Logout failed');
    });
  });
});
