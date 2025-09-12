import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ShopScreen from '../../app/shop';
import { LocalStore } from '@/data/storage/LocalStore';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: jest.fn(), push: jest.fn() },
}));

describe('ShopScreen integration with ProductsUseCases', () => {
  it('hydrates from LocalStore and filters by category and search', async () => {
    const now = new Date();
    LocalStore.setJSON('products', [
      {
        id: 'p100',
        name: 'Vase Bleu',
        description: 'Vase artisanal bleu',
        priceCents: 4500,
        currency: 'EUR',
        imageUrls: ['https://example.com/vase.jpg'],
        sellerName: 'Art Studio',
        category: 'Poterie',
        rating: 4.9,
        sales: 10,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const { getByText, getByPlaceholderText, queryByText } = render(<ShopScreen />);

    // wait for hydration
    await waitFor(() => {
      expect(getByText('Vase Bleu')).toBeTruthy();
    });

    fireEvent.press(getByText('Poterie'));
    const input = getByPlaceholderText('Search');
    fireEvent.changeText(input, 'Vase');

    expect(getByText('Vase Bleu')).toBeTruthy();
    expect(queryByText('Guide de cuisine')).toBeNull();
  });
});


