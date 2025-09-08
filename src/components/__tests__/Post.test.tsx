import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Post from '../specific/Post';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const mockAnimated = {
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    Value: jest.fn().mockImplementation((value) => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    NativeAnimatedHelper: jest.fn(),
    View: 'Animated.View',
  };

  return {
    Alert: { alert: jest.fn() },
    Animated: mockAnimated,
    Dimensions: { get: jest.fn(() => ({ width: 375, height: 812 })) },
    Platform: { OS: 'ios', select: jest.fn() },
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    TouchableOpacity: 'TouchableOpacity',
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
    },
    ActivityIndicator: 'ActivityIndicator',
  };
});

// Get references to mocked functions
const { Alert, Animated } = require('react-native');

const mockPost = {
  id: '1',
  user: {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    handle: '@johndoe',
    verified: true,
  },
  content: 'This is a test post content',
  image: 'https://example.com/post-image.jpg',
  likes: 42,
  comments: 5,
  shares: 3,
  timestamp: '2h',
  price: '$99.99',
};

const mockPostWithoutOptionals = {
  id: '2',
  user: {
    name: 'Jane Smith',
    avatar: 'https://example.com/jane-avatar.jpg',
    handle: '@janesmith',
  },
  content: 'Another test post',
  likes: 10,
  comments: 2,
  shares: 1,
  timestamp: '1h',
};

describe('Post Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date.now for consistent testing
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render post with all information', () => {
    const { getByText } = render(<Post post={mockPost} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('@johndoe')).toBeTruthy();
    expect(getByText('This is a test post content')).toBeTruthy();
    expect(getByText('2h')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('should render post without optional fields', () => {
    const { getByText } = render(<Post post={mockPostWithoutOptionals} />);

    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('@janesmith')).toBeTruthy();
    expect(getByText('Another test post')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
  });

  it('should show buy button when post has price', () => {
    const { getByText } = render(<Post post={mockPost} />);
    expect(getByText('Acheter $99.99')).toBeTruthy();
  });

  it('should not show buy button when post has no price', () => {
    const { queryByText } = render(<Post post={mockPostWithoutOptionals} />);
    expect(queryByText(/Acheter/)).toBeNull();
  });

  it('should show verified badge for verified users', () => {
    const { getByTestId } = render(<Post post={mockPost} />);
    expect(getByTestId('verified-badge')).toBeTruthy();
  });

  it('should not show verified badge for unverified users', () => {
    const { queryByTestId } = render(<Post post={mockPostWithoutOptionals} />);
    expect(queryByTestId('verified-badge')).toBeNull();
  });

  describe('Number formatting', () => {
    it('should format large numbers with k suffix', () => {
      const postWithLargeNumbers = {
        ...mockPost,
        likes: 1500,
        comments: 2300,
        shares: 999,
      };
      const { getByText } = render(<Post post={postWithLargeNumbers} />);

      expect(getByText('1.5k')).toBeTruthy();
      expect(getByText('2.3k')).toBeTruthy();
      expect(getByText('999')).toBeTruthy(); // Under 1000, no k suffix
    });

    it('should handle exact thousands', () => {
      const postWithExactThousands = {
        ...mockPost,
        likes: 1000,
        comments: 5000,
      };
      const { getByText } = render(<Post post={postWithExactThousands} />);

      expect(getByText('1.0k')).toBeTruthy();
      expect(getByText('5.0k')).toBeTruthy();
    });
  });

  describe('Like functionality', () => {
    it('should toggle like state when like button is pressed', () => {
      const { getByTestId, getByText } = render(<Post post={mockPost} />);
      const likeButton = getByTestId('like-button');

      // Initial state - not liked, shows original count
      expect(getByText('42')).toBeTruthy();

      // Like the post
      fireEvent.press(likeButton);
      expect(getByText('43')).toBeTruthy();

      // Unlike the post
      fireEvent.press(likeButton);
      expect(getByText('42')).toBeTruthy();
    });

    it('should animate when like button is pressed', () => {
      const { getByTestId } = render(<Post post={mockPost} />);
      const likeButton = getByTestId('like-button');

      fireEvent.press(likeButton);

      expect(Animated.sequence).toHaveBeenCalled();
    });
  });

  describe('Double tap to like', () => {
    it('should like post on double tap', () => {
      const { getByTestId, getByText } = render(<Post post={mockPost} />);
      const postContainer = getByTestId('post-container');

      // First tap
      fireEvent.press(postContainer);

      // Second tap within delay
      jest.spyOn(Date, 'now').mockReturnValue(1200); // 200ms later
      fireEvent.press(postContainer);

      expect(getByText('43')).toBeTruthy(); // Liked
    });

    it('should not like on single tap', () => {
      const { getByTestId, getByText } = render(<Post post={mockPost} />);
      const postContainer = getByTestId('post-container');

      fireEvent.press(postContainer);

      expect(getByText('42')).toBeTruthy(); // Not liked
    });

    it('should not like on taps outside double tap delay', () => {
      const { getByTestId, getByText } = render(<Post post={mockPost} />);
      const postContainer = getByTestId('post-container');

      // First tap
      fireEvent.press(postContainer);

      // Second tap after delay
      jest.spyOn(Date, 'now').mockReturnValue(1400); // 400ms later (beyond 300ms delay)
      fireEvent.press(postContainer);

      expect(getByText('42')).toBeTruthy(); // Not liked
    });
  });

  describe('Comment functionality', () => {
    it('should show comment alert when comment button is pressed', () => {
      const { getByTestId } = render(<Post post={mockPost} />);
      const commentButton = getByTestId('comment-button');

      fireEvent.press(commentButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Commentaires',
        'Fonctionnalité des commentaires bientôt disponible !',
        expect.any(Array),
      );
    });

    it('should increment comment count when simulate comment is pressed', () => {
      const { getByTestId, getByText } = render(<Post post={mockPost} />);
      const commentButton = getByTestId('comment-button');

      fireEvent.press(commentButton);

      // Simulate pressing the "Simuler un commentaire" button
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const simulateCommentAction = alertCall[2][1]; // Second button
      act(() => {
        simulateCommentAction.onPress();
      });

      expect(getByText('6')).toBeTruthy(); // Comment count increased
    });
  });

  describe('Share functionality', () => {
    it('should show share alert when share button is pressed', () => {
      const { getByTestId } = render(<Post post={mockPost} />);
      const shareButton = getByTestId('share-button');

      fireEvent.press(shareButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Partager',
        'Partager la publication de John Doe ?',
        expect.any(Array),
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile when avatar is pressed', () => {
      const router = require('expo-router').router;
      const { getByTestId } = render(<Post post={mockPost} />);
      const avatar = getByTestId('user-avatar');

      fireEvent.press(avatar);

      expect(router.push).toHaveBeenCalledWith('/profile/user1');
    });

    it('should navigate to profile when user name is pressed', () => {
      const router = require('expo-router').router;
      const { getByText } = render(<Post post={mockPost} />);
      const userName = getByText('John Doe');

      fireEvent.press(userName);

      expect(router.push).toHaveBeenCalledWith('/profile/user1');
    });

    it('should navigate to post detail when post is pressed', () => {
      const router = require('expo-router').router;
      const { getByTestId } = render(<Post post={mockPost} />);
      const postContainer = getByTestId('post-container');

      // Single tap should navigate
      fireEvent.press(postContainer);

      // Wait to ensure it's not a double tap
      jest.spyOn(Date, 'now').mockReturnValue(1400);

      expect(router.push).toHaveBeenCalledWith('/post/1');
    });
  });

  describe('Buy functionality', () => {
    it('should show buy alert when buy button is pressed', () => {
      const { getByText } = render(<Post post={mockPost} />);
      const buyButton = getByText('Acheter $99.99');

      fireEvent.press(buyButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Acheter',
        'Redirection vers la page de commande...',
        expect.any(Array),
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = render(<Post post={mockPost} />);

      expect(getByTestId('like-button')).toBeTruthy();
      expect(getByTestId('comment-button')).toBeTruthy();
      expect(getByTestId('share-button')).toBeTruthy();
      expect(getByTestId('user-avatar')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle post with zero interactions', () => {
      const postWithZeros = {
        ...mockPost,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      const { getByText } = render(<Post post={postWithZeros} />);

      expect(getByText('0')).toBeTruthy();
    });

    it('should handle very long content', () => {
      const postWithLongContent = {
        ...mockPost,
        content:
          'This is a very long post content that should be displayed properly even when it contains a lot of text and might wrap to multiple lines in the UI',
      };
      const { getByText } = render(<Post post={postWithLongContent} />);

      expect(getByText(postWithLongContent.content)).toBeTruthy();
    });
  });
});
