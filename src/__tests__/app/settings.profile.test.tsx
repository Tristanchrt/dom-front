import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileEditScreen from '../../app/settings/profile';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: jest.fn() },
}));

describe('ProfileEditScreen (app/settings/profile)', () => {
  it('shows alert when saving profile', async () => {
    jest.spyOn(Alert, 'alert');

    const { getByText } = render(<ProfileEditScreen />);
    fireEvent.press(getByText('Sauvegarder les modifications'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '✅ Profil sauvegardé',
        'Vos modifications ont été enregistrées avec succès',
        [{ text: 'OK' }]
      );
    });
  });
});



