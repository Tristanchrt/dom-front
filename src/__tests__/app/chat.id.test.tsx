import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ChatScreen from '../../app/chat/[id]';

jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn() },
}));

const setRouteId = (id: string | undefined) => {
  const { useLocalSearchParams } = require('expo-router');
  (useLocalSearchParams as jest.Mock).mockReturnValue(id ? { id } : {});
};

describe('ChatScreen (app/chat/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error for unknown user', () => {
    setRouteId('unknown');
    const { getByText } = render(<ChatScreen />);
    expect(getByText('User not found')).toBeTruthy();
  });

  it('renders header with user info for known user', async () => {
    setRouteId('u1');
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('MICHEL PAGE')).toBeTruthy();
    });
  });
});
