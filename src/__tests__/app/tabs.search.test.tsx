import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchScreen from '../../app/(tabs)/search';

describe('SearchScreen (tabs/search)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state for unmatched query', () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);

    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'zzzz_non_match');

    expect(getByText('No results')).toBeTruthy();
  });

  it('navigates to profile when pressing a creator result', () => {
    const { getByText } = render(<SearchScreen />);

    fireEvent.press(getByText('Marie Dubois'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/profile/c1');
  });

  it('switches tabs to shop and navigates to a product', () => {
    const { getByText } = render(<SearchScreen />);

    fireEvent.press(getByText('Shop'));
    fireEvent.press(getByText('Vase en céramique'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/product/p2');
  });
});
