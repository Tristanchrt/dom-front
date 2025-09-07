import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrdersScreen from '../../app/settings/orders';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: jest.fn() },
}));

describe('OrdersScreen (app/settings/orders)', () => {
  it('switches filters and shows counts', () => {
    const { getByText } = render(<OrdersScreen />);

    // Default is 'all'
    expect(getByText(/Toutes \(\d+\)/)).toBeTruthy();

    fireEvent.press(getByText(/Payées/));
    expect(getByText(/Payées \(\d+\)/)).toBeTruthy();

    fireEvent.press(getByText(/En attente/));
    expect(getByText(/En attente \(\d+\)/)).toBeTruthy();
  });
});



