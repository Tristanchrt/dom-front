import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock params before importing component
jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(() => ({ id: 'p1' })),
  router: { back: jest.fn() },
}));

import ProductDetailScreen from '../../app/product/[id]';

jest.spyOn(Alert, 'alert');

describe('ProductDetailScreen (product/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product p1 and adds to cart', async () => {
    const { getByText } = render(<ProductDetailScreen />);

    // Title exists
    expect(getByText('T-SHIRT COUTUMAIN')).toBeTruthy();

    // Add to cart triggers alert
    fireEvent.press(getByText('Add to cart'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining('🛒 Added to cart'),
        expect.any(String),
        expect.any(Array),
      );
    });
  });
});
