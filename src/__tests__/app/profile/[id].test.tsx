import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreatorProfileScreen from '../../../app/profile/[id]';

jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn(), push: jest.fn() },
}));

const setRouteId = (id: string | undefined) => {
  const { useLocalSearchParams } = require('expo-router');
  (useLocalSearchParams as jest.Mock).mockReturnValue(id ? { id } : {});
};

describe('CreatorProfileScreen (app/profile/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error state for unknown creator id', () => {
    setRouteId('unknown');
    const { getByText } = render(<CreatorProfileScreen />);
    expect(getByText('Profil non trouvé')).toBeTruthy();
  });

  it('renders profile and toggles follow state', () => {
    setRouteId('c1');
    const { getByText, getAllByText, queryByText } = render(<CreatorProfileScreen />);

    // Basic info
    const nameMatches = getAllByText('Marie Dubois');
    expect(nameMatches.length).toBeGreaterThan(0);

    // Follow -> Abonné
    const followBtn = getByText('Suivre');
    fireEvent.press(followBtn);
    expect(queryByText('Abonné')).toBeTruthy();
  });

  it('switches to Produits tab and shows a product', () => {
    setRouteId('c1');
    const { getByText } = render(<CreatorProfileScreen />);

    fireEvent.press(getByText('Produits'));
    expect(getByText('Guide Voyage Islande')).toBeTruthy();
  });
});


