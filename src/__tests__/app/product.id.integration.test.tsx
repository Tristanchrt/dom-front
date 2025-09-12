import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProductDetailScreen from '../../app/product/[id]';
import { LocalStore } from '@/data/storage/LocalStore';

jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(() => ({ id: 'p1' })),
  router: { back: jest.fn(), push: jest.fn() },
}));

describe('ProductDetailScreen integration with ProductsUseCases', () => {
  it('hydrates name and price from repo while keeping fixture UI', async () => {
    const now = new Date();
    LocalStore.setJSON('products', [
      {
        id: 'p1',
        name: 'Super Vase',
        priceCents: 4599,
        currency: 'EUR',
        imageUrls: ['https://example.com/vase.jpg'],
        sellerName: 'Art Studio',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const { findByText } = render(<ProductDetailScreen />);
    // Name from repo is uppercased in UI
    await waitFor(async () => {
      expect(await findByText('SUPER VASE')).toBeTruthy();
      expect(await findByText('45,99€')).toBeTruthy();
    });
  });
});


