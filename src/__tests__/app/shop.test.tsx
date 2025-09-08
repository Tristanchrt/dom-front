import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShopScreen from '../../app/shop';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { push: jest.fn(), back: jest.fn() },
}));

describe('ShopScreen (app/shop)', () => {
  it('filters by category and search query', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ShopScreen />);

    // Filter by category "Poterie"
    fireEvent.press(getByText('Poterie'));

    // Search for a term that matches seller or name
    const input = getByPlaceholderText('Search');
    fireEvent.changeText(input, 'vase');

    // Should show product containing 'Vase'
    expect(getByText(/Vase/i)).toBeTruthy();
    // And likely hide unrelated items
    expect(queryByText(/Carnet de voyage/i)).toBeNull();
  });
});
