import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductsScreen from '../../app/settings/products';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: jest.fn() },
}));

describe('ProductsScreen (app/settings/products)', () => {
  it('toggles tabs and shows counts', () => {
    const { getByText } = render(<ProductsScreen />);

    // Default active tab
    expect(getByText(/Active \(\d+\)/)).toBeTruthy();

    fireEvent.press(getByText(/Draft \(\d+\)/));
    expect(getByText(/Draft \(\d+\)/)).toBeTruthy();
  });
});
