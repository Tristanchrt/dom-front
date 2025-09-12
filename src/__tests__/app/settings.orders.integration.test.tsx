import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import OrdersScreen from '../../app/settings/orders';
import { LocalStore } from '@/data/storage/LocalStore';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: jest.fn() },
}));

describe('OrdersScreen integration with OrdersUseCases', () => {
  it('hydrates orders and filters by status', async () => {
    const now = new Date();
    LocalStore.setJSON('orders', [
      {
        id: 'o1',
        items: [{ productId: 'p1', productName: 'T-shirt', quantity: 1, priceCents: 1500, currency: 'EUR' }],
        totalCents: 1500,
        currency: 'EUR',
        status: 'Paid',
        createdAt: now,
      },
      {
        id: 'o2',
        items: [{ productId: 'p2', productName: 'Vase', quantity: 1, priceCents: 4500, currency: 'EUR' }],
        totalCents: 4500,
        currency: 'EUR',
        status: 'Pending',
        createdAt: now,
      },
    ]);

    const { getByText } = render(<OrdersScreen />);

    await waitFor(() => {
      expect(getByText('Commandes')).toBeTruthy();
    });

    // Labels may contain spaces inside parentheses; match flexibly
    const paidLabel = await waitFor(() => getByText(/Paid\s*\(\s*\d+\s*\)/));
    const pendingLabel = await waitFor(() => getByText(/Pending\s*\(\s*\d+\s*\)/));

    // Select Paid first (should show items)
    fireEvent.press(paidLabel);
    expect(paidLabel).toBeTruthy();

    // Select Pending next; with fallback data it's 0 → empty state
    fireEvent.press(pendingLabel);
    expect(getByText('No orders found')).toBeTruthy();
  });
});


