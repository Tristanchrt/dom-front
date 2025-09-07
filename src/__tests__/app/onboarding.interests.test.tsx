import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InterestsSelectionScreen from '../../app/onboarding/interests';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { replace: jest.fn(), back: jest.fn() },
}));

describe('InterestsSelectionScreen (app/onboarding/interests)', () => {
  it('requires at least 3 interests before continue', () => {
    const { getByText } = render(<InterestsSelectionScreen />);

    // Initially disabled
    expect(getByText(/Continuer \(0\)/)).toBeTruthy();

    // Select 3 interests
    fireEvent.press(getByText('Art & Design'));
    fireEvent.press(getByText('Photographie'));
    fireEvent.press(getByText('Cuisine'));

    // Button displays current count
    expect(getByText(/Continuer \(3\)/)).toBeTruthy();

    fireEvent.press(getByText(/Continuer/));
    const { router } = require('expo-router');
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});


