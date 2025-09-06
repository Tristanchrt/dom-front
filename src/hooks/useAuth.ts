import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@store/auth.store';
import { AuthUseCases } from '@domain/usecases/auth/AuthUseCases';
import { AuthRepositoryImpl } from '@data/repositories/AuthRepository.impl';
import { AuthApi } from '@data/api/auth.api';
import { CreateUserRequest } from '@domain/models/User';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    setUser,
    setLoading,
    setError,
    logout: logoutStore,
  } = useAuthStore();

  const authUseCases = useMemo(() => {
    const authApi = new AuthApi();
    const authRepository = new AuthRepositoryImpl(authApi);
    return new AuthUseCases(authRepository);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authUseCases.login(email, password);
      setUser(user);
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authUseCases, setLoading, setError, setUser]);

  const register = useCallback(async (request: CreateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authUseCases.register(request);
      setUser(user);
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authUseCases, setLoading, setError, setUser]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      await authUseCases.logout();
      logoutStore();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authUseCases, setLoading, setError, logoutStore]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      
      const user = await authUseCases.getCurrentUser();
      setUser(user);
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [authUseCases, setLoading, setError, setUser]);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    
    // Utils
    clearError: () => setError(null),
  };
};
