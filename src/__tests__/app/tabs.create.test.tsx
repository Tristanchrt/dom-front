import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CreatePostScreen from '../../app/(tabs)/create';

jest.spyOn(Alert, 'alert');

describe('CreatePostScreen (tabs/create)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates empty text post on publish', async () => {
    const { getByText } = render(<CreatePostScreen />);

    fireEvent.press(getByText('Publier'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Veuillez saisir du texte pour votre publication');
    });
  });

  it('switches type to poll and validates missing fields', async () => {
    const { getByText } = render(<CreatePostScreen />);

    fireEvent.press(getByText('Sondage'));
    fireEvent.press(getByText('Publier'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Veuillez compléter la question et toutes les options du sondage');
    });
  });
});


