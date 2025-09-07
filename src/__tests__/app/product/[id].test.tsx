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

    expect(getByText('Produit non trouvé')).toBeTruthy();
  });

  it('renders product details for p1 and shows welcome offer', () => {
    setRouteId('p1');

    const { getByText, getAllByText } = render(<ProductDetailScreen />);

    // Default selections applied from useEffect
    expect(getByText('Couleur: Beige')).toBeTruthy();
    expect(getByText('Taille: S')).toBeTruthy();

    // Welcome banner
    expect(getByText('Offre de bienvenue')).toBeTruthy();

    // Seller line visible (appears in multiple places)
    const sellerLines = getAllByText(/Vendu par/i);
    expect(sellerLines.length).toBeGreaterThanOrEqual(1);
  });

  it('updates selected color when a color option is pressed', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Noir'));

    await waitFor(() => {
      expect(getByText('Couleur: Noir')).toBeTruthy();
    });
  });

  it('shows alert when adding to cart', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Ajouter au panier'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '🛒 Ajouté au panier',
        expect.stringContaining('T-shirt coutumain'),
        expect.any(Array)
      );
    });
  });

  it('shows purchase confirmation alert when buying', async () => {
    setRouteId('p1');

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Acheter'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining('💳 Confirmer'),
        expect.stringContaining('Acheter:'),
        expect.any(Array)
      );
    });
  });
});


