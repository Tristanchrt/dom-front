import { AuthUseCases, AuthRepository } from './AuthUseCases';
import { User, CreateUserRequest } from '@domain/models/User';

describe('AuthUseCases', () => {
  let authUseCases: AuthUseCases;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
    };
    authUseCases = new AuthUseCases(mockAuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockAuthRepository.login.mockResolvedValue(mockUser);

      const result = await authUseCases.login('john@example.com', 'password');

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.login).toHaveBeenCalledWith('john@example.com', 'password');
    });

    it('should throw error when email is empty', async () => {
      await expect(authUseCases.login('', 'password')).rejects.toThrow(
        'Email and password are required',
      );
      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error when password is empty', async () => {
      await expect(authUseCases.login('john@example.com', '')).rejects.toThrow(
        'Email and password are required',
      );
      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error when email format is invalid', async () => {
      await expect(authUseCases.login('invalid-email', 'password')).rejects.toThrow(
        'Invalid email format',
      );
      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      mockAuthRepository.login.mockRejectedValue(new Error('Network error'));

      await expect(authUseCases.login('john@example.com', 'password')).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('register', () => {
    const validRequest: CreateUserRequest = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    it('should register successfully with valid data', async () => {
      mockAuthRepository.register.mockResolvedValue(mockUser);

      const result = await authUseCases.register(validRequest);

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.register).toHaveBeenCalledWith(validRequest);
    });

    it('should throw error when name is empty', async () => {
      const request = { ...validRequest, name: '' };

      await expect(authUseCases.register(request)).rejects.toThrow('Name and email are required');
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when email is empty', async () => {
      const request = { ...validRequest, email: '' };

      await expect(authUseCases.register(request)).rejects.toThrow('Name and email are required');
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when email format is invalid', async () => {
      const request = { ...validRequest, email: 'invalid-email' };

      await expect(authUseCases.register(request)).rejects.toThrow('Invalid email format');
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when name is too short', async () => {
      const request = { ...validRequest, name: 'A' };

      await expect(authUseCases.register(request)).rejects.toThrow(
        'Name must be at least 2 characters long',
      );
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it('should register with avatar when provided', async () => {
      const requestWithAvatar = { ...validRequest, avatar: 'http://example.com/avatar.jpg' };
      mockAuthRepository.register.mockResolvedValue(mockUser);

      await authUseCases.register(requestWithAvatar);

      expect(mockAuthRepository.register).toHaveBeenCalledWith(requestWithAvatar);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockAuthRepository.logout.mockResolvedValue();

      await authUseCases.logout();

      expect(mockAuthRepository.logout).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      mockAuthRepository.logout.mockRejectedValue(new Error('Logout failed'));

      await expect(authUseCases.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);

      const result = await authUseCases.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when not authenticated', async () => {
      mockAuthRepository.getCurrentUser.mockResolvedValue(null);

      const result = await authUseCases.getCurrentUser();

      expect(result).toBeNull();
      expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      mockAuthRepository.getCurrentUser.mockRejectedValue(new Error('Fetch failed'));

      await expect(authUseCases.getCurrentUser()).rejects.toThrow('Fetch failed');
    });
  });
});
