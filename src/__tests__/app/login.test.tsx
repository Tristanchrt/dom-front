import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// expo-router is globally mocked in jest.setup.ts
import LoginScreen from '../../app/login';

describe('LoginScreen (app/login)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to onboarding on Google login', () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Continuez avec Google'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/onboarding/profile-setup');
  });

  it('navigates to onboarding on Facebook login', () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Continuez avec Facebook'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/onboarding/profile-setup');
  });

  it('replaces to tabs on email login', () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Se connecter'));

    const { router } = require('expo-router');
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});


