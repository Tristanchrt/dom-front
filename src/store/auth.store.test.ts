import { useAuthStore } from './auth.store';
import { User } from '@domain/models/User';

describe('AuthStore', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.getState().logout();
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const { setUser } = useAuthStore.getState();

      setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should clear user and mark as unauthenticated when user is null', () => {
      // First set a user
      useAuthStore.getState().setUser(mockUser);
      
      // Then clear it
      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should clear error when setting user', () => {
      // First set an error
      useAuthStore.getState().setError('Test error');
      
      // Then set user
      useAuthStore.getState().setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const { setLoading } = useAuthStore.getState();

      setLoading(true);

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      // First set loading to true
      useAuthStore.getState().setLoading(true);
      
      // Then set to false
      useAuthStore.getState().setLoading(false);

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error and stop loading', () => {
      // First set loading to true
      useAuthStore.getState().setLoading(true);
      
      // Then set error
      const { setError } = useAuthStore.getState();
      setError('Test error');

      const state = useAuthStore.getState();
      expect(state.error).toBe('Test error');
      expect(state.isLoading).toBe(false);
    });

    it('should clear error when set to null', () => {
      // First set an error
      useAuthStore.getState().setError('Test error');
      
      // Then clear it
      useAuthStore.getState().setError(null);

      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should reset all state when logging out', () => {
      // Set up some state
      const { setUser, setLoading, setError } = useAuthStore.getState();
      setUser(mockUser);
      setLoading(true);
      setError('Some error');

      // Then logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should handle complete authentication flow', () => {
      const { setLoading, setUser, setError, logout } = useAuthStore.getState();

      // Start loading
      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Successful login
      setUser(mockUser);
      const afterLogin = useAuthStore.getState();
      expect(afterLogin.user).toEqual(mockUser);
      expect(afterLogin.isAuthenticated).toBe(true);
      expect(afterLogin.error).toBeNull();

      // Error occurs
      setError('Network error');
      const afterError = useAuthStore.getState();
      expect(afterError.error).toBe('Network error');
      expect(afterError.isLoading).toBe(false);

      // Logout
      logout();
      const afterLogout = useAuthStore.getState();
      expect(afterLogout.user).toBeNull();
      expect(afterLogout.isAuthenticated).toBe(false);
      expect(afterLogout.error).toBeNull();
      expect(afterLogout.isLoading).toBe(false);
    });
  });
});
