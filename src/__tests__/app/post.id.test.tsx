import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PostDetailScreen from '../../app/post/[id]';

jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn(), push: jest.fn() },
}));

const setRouteId = (id: string | undefined) => {
  const { useLocalSearchParams } = require('expo-router');
  (useLocalSearchParams as jest.Mock).mockReturnValue(id ? { id } : {});
};

describe('PostDetailScreen (app/post/[id])', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error state when post not found', () => {
    setRouteId('unknown');
    const { getByText } = render(<PostDetailScreen />);
    expect(getByText('Publication non trouvée')).toBeTruthy();
  });

  it('renders post details and toggles liked state', async () => {
    setRouteId('e1');
    const { findByText } = render(<PostDetailScreen />);

    const likeCount = await findByText('8.2k');

    fireEvent.press(likeCount);
    expect(likeCount).toHaveStyle({ color: '#FF4444' });
  });
});


