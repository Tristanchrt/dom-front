import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileSetupScreen from '../../app/onboarding/profile-setup';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { push: jest.fn() },
}));

describe('ProfileSetupScreen (app/onboarding/profile-setup)', () => {
  it('validates name and navigates on continue', () => {
    const { getByText, getByPlaceholderText } = render(<ProfileSetupScreen />);

    // Attempt continue with empty name triggers alert internally; then fill name
    fireEvent.press(getByText('Continuer'));

    fireEvent.changeText(getByPlaceholderText('Nom et prénom'), 'John Doe');
    fireEvent.press(getByText('Continuer'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/onboarding/test-debug');
  });

  it('can navigate to interests via Passer', () => {
    const { getByText } = render(<ProfileSetupScreen />);
    fireEvent.press(getByText('Passer'));
    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/onboarding/interests');
  });
});


