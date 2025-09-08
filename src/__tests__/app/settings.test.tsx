import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../app/settings';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { push: jest.fn(), back: jest.fn() },
}));

describe('SettingsScreen (app/settings)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to products, profile, and orders pages', () => {
    const { getByText } = render(<SettingsScreen />);

    fireEvent.press(getByText('My products'));
    fireEvent.press(getByText('Customize your profile'));
    fireEvent.press(getByText('My orders'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/settings/products');
    expect(router.push).toHaveBeenCalledWith('/settings/profile');
    expect(router.push).toHaveBeenCalledWith('/settings/orders');
  });
});
