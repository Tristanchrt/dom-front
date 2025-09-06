import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { LoginScreen } from './LoginScreen';
import { useAuth } from '@hooks/useAuth';


// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock useAuth hook
jest.mock('@hooks/useAuth');

describe('LoginScreen', () => {
  const mockAuth = {
    login: jest.fn(),
    isLoading: false,
    error: null,
    user: null,
    isAuthenticated: false,
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    clearError: jest.fn(),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to your account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('should validate email input', async () => {
    const { getByTestId } = render(<LoginScreen />);
    
    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByTestId('email-input-error')).toBeTruthy();
    });
  });

  it('should validate password input', async () => {
    const { getByTestId, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByTestId('password-input-error')).toBeTruthy();
    });
  });

  it('should validate email format', async () => {
    const { getByTestId, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByTestId('email-input-error')).toBeTruthy();
    });
  });

  it('should validate password length', async () => {
    const { getByTestId, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByTestId('password-input-error')).toBeTruthy();
    });
  });

  it('should call login with valid credentials', async () => {
    mockAuth.login.mockResolvedValue({ id: '1', email: 'test@example.com' });
    
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show success alert on successful login', async () => {
    mockAuth.login.mockResolvedValue({ id: '1', email: 'test@example.com' });
    
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Login successful!');
    });
  });

  it('should show error alert on failed login', async () => {
    mockAuth.login.mockRejectedValue(new Error('Invalid credentials'));
    
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByTestId('login-button');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });

  it('should show loading state during login', () => {
    const loadingAuth = { ...mockAuth, isLoading: true };
    (useAuth as jest.Mock).mockReturnValue(loadingAuth);
    
    const { getByTestId } = render(<LoginScreen />);
    
    const loginButton = getByTestId('login-button');
    
    // Button should be disabled and show loading
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should display auth error when present', () => {
    const errorAuth = { ...mockAuth, error: 'Network error' };
    (useAuth as jest.Mock).mockReturnValue(errorAuth);
    
    const { getByTestId } = render(<LoginScreen />);
    
    expect(getByTestId('login-error')).toBeTruthy();
  });

  it('should handle keyboard avoiding view on iOS', () => {
    // This test ensures the KeyboardAvoidingView is rendered
    const { UNSAFE_getByType } = render(<LoginScreen />);
    
    const keyboardAvoidingView = UNSAFE_getByType(KeyboardAvoidingView);
    expect(keyboardAvoidingView).toBeTruthy();
  });

  it('should clear validation errors when input changes', async () => {
    const { getByPlaceholderText, getByTestId, queryByTestId } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const loginButton = getByTestId('login-button');
    
    // Trigger validation error
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(getByTestId('email-input-error')).toBeTruthy();
    });
    
    // Enter valid email
    fireEvent.changeText(emailInput, 'test@example.com');
    
    // Error should be cleared (this happens on the next validation attempt)
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(queryByTestId('email-input-error')).toBeFalsy();
    });
  });
});
