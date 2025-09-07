import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MessagingScreen from '../../app/(tabs)/messaging';

describe('MessagingScreen (tabs/messaging)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters conversations by search query', () => {
    const { getByPlaceholderText, queryByText } = render(<MessagingScreen />);

    const input = getByPlaceholderText('Rechercher');
    fireEvent.changeText(input, 'Parfait');

    expect(queryByText('Michel blanc tussaf.com')).toBeNull();
  });

  it('navigates to chat when pressing a conversation item', () => {
    const { getByText } = render(<MessagingScreen />);

    fireEvent.press(getByText('Michel blanc tussaf.com'));

    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/chat/u1');
  });
});


