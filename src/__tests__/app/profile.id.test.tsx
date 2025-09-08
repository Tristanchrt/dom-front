import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock container to control profilesUseCases
jest.mock('@/data/container', () => ({
  __esModule: true,
  profilesUseCases: {
    getById: jest.fn(),
    toggleFollow: jest.fn(),
  },
}));

import ProfileScreen from '../../app/profile/[id]';

describe('CreatorProfileScreen (profile/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads followers from use case and toggles follow', async () => {
    const expoRouter = require('expo-router');
    jest.spyOn(expoRouter, 'useLocalSearchParams').mockReturnValue({ id: 'c1' });

    const { profilesUseCases } = require('@/data/container');
    profilesUseCases.getById.mockResolvedValue({
      id: 'c1',
      name: 'X',
      handle: '@x',
      followersCount: 999,
      followingCount: 0,
      postsCount: 0,
      verified: false,
    });
    profilesUseCases.toggleFollow.mockResolvedValue(undefined);

    const { getByText } = render(<ProfileScreen />);

    // followers come from use case: 999
    await waitFor(() => {
      expect(getByText('999')).toBeTruthy();
    });

    // toggle follow → becomes 1.0k
    fireEvent.press(getByText('Suivre'));

    await waitFor(() => {
      expect(getByText('1.0k')).toBeTruthy();
      expect(getByText('Abonné')).toBeTruthy();
    });

    expect(profilesUseCases.toggleFollow).toHaveBeenCalledWith('c1', false);
  });

  it('shows not-found for unknown id', () => {
    const expoRouter = require('expo-router');
    jest.spyOn(expoRouter, 'useLocalSearchParams').mockReturnValue({ id: 'unknown' });

    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Profil non trouvé')).toBeTruthy();
  });
});
