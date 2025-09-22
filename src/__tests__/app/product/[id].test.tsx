import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProductDetailScreen from '../../../app/product/[id]';

// Spy on native Alert
jest.spyOn(Alert, 'alert');

// Mock expo-router to control route params and navigation
jest.mock('expo-router', () => {
  return {
    useLocalSearchParams: jest.fn(),
    router: { back: jest.fn() },
  };
});

// Helper to set current route id
const setRouteId = (id: string | undefined) => {
  const { useLocalSearchParams } = require('expo-router');
  (useLocalSearchParams as jest.Mock).mockReturnValue(id ? { id } : {});
};

describe('ProductDetailScreen (app/product/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders not found state when product id is unknown', () => {
    setRouteId('unknown');

    const { getByText } = render(<ProductDetailScreen />);

    expect(getByText('Product not found')).toBeTruthy();
  });

  it('updates selected color when a color option is pressed', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Noir'));

    await waitFor(() => {
      expect(getByText('Color: Noir')).toBeTruthy();
    });
  });

  it('shows alert when adding to cart', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Add to cart'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining('🛒 Added to cart'),
        expect.any(String),
        expect.any(Array),
      );
    });
  });

  it('shows purchase confirmation alert when buying', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Buy'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining('💳 Confirm purchase'),
        expect.stringContaining('Buy:'),
        expect.any(Array),
      );
    });
  });
});
