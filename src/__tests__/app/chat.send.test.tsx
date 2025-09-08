import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '@/app/chat/[id]';

jest.mock('expo-router', () => ({
  __esModule: true,
  useLocalSearchParams: jest.fn(() => ({ id: 'u1' })),
  router: { back: jest.fn() },
}));

jest.mock('@/data/container', () => {
  const real = jest.requireActual('@/data/container');
  return {
    __esModule: true,
    ...real,
    messagingUseCases: {
      getConversations: jest.fn().mockResolvedValue({
        conversations: [
          {
            id: 'u1',
            user: {
              id: 'u1',
              name: 'MICHEL PAGE',
              email: 'michel@example.com',
              avatar: '',
              username: 'michel.page',
              specialty: 'Tech',
              isOnline: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            lastMessage: '',
            timestamp: 'now',
            unreadCount: 0,
            hasNewMessage: false,
          },
        ],
        total: 1,
      }),
      getMessages: jest.fn().mockResolvedValue([]),
      sendMessage: jest.fn().mockResolvedValue({ id: 'mX', content: 'hello', senderId: 'me', receiverId: 'u1', timestamp: new Date(), isRead: false }),
    },
  };
});

describe('ChatScreen send message', () => {
  it('appends new message after sending', async () => {
    const { findByPlaceholderText, getByLabelText, findByText } = render(<ChatScreen />);

    const input = await findByPlaceholderText('Type your message...');
    fireEvent.changeText(input, 'hello');
    fireEvent.press(getByLabelText('Send'));

    await waitFor(async () => {
      expect(await findByText('hello')).toBeTruthy();
    });
  });
});


