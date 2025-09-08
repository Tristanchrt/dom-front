import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ExternalLink } from '../specific/ExternalLink';

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children, onPress, href, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    const handlePress = () => {
      if (onPress) {
        const mockEvent = {
          preventDefault: jest.fn(),
        };
        onPress(mockEvent);
      }
    };
    return (
      <TouchableOpacity onPress={handlePress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

const mockOpenBrowserAsync = WebBrowser.openBrowserAsync as jest.MockedFunction<
  typeof WebBrowser.openBrowserAsync
>;

describe('ExternalLink Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with href', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com">Visit Example</ExternalLink>,
    );
    expect(getByText('Visit Example')).toBeTruthy();
  });

  it('should open in-app browser on native platforms', () => {
    Platform.OS = 'ios'; // Mock iOS platform
    mockOpenBrowserAsync.mockResolvedValue({} as any);

    const { getByText } = render(
      <ExternalLink href="https://example.com">Visit Example</ExternalLink>,
    );

    const link = getByText('Visit Example');
    fireEvent.press(link);

    expect(mockOpenBrowserAsync).toHaveBeenCalledWith('https://example.com');
  });

  it('should not call WebBrowser on web platform', () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web'; // Mock web platform

    const { getByText } = render(
      <ExternalLink href="https://example.com">Visit Example</ExternalLink>,
    );

    const link = getByText('Visit Example');
    fireEvent.press(link);

    expect(mockOpenBrowserAsync).not.toHaveBeenCalled();

    // Restore original platform
    Platform.OS = originalPlatform;
  });

  it('should pass through additional props', () => {
    const { getByTestId } = render(
      <ExternalLink
        href="https://example.com"
        testID="external-link"
        accessibilityLabel="External link"
      >
        Visit Example
      </ExternalLink>,
    );

    const link = getByTestId('external-link');
    expect(link.props.accessibilityLabel).toBe('External link');
  });

  it('should handle different URL formats', () => {
    Platform.OS = 'ios';
    mockOpenBrowserAsync.mockResolvedValue({} as any);

    const testUrls = [
      'https://example.com',
      'http://example.com',
      'https://subdomain.example.com/path',
      'https://example.com/path?query=value#hash',
    ];

    testUrls.forEach((url) => {
      const { getByText } = render(<ExternalLink href={url}>{url}</ExternalLink>);

      const link = getByText(url);
      fireEvent.press(link);

      expect(mockOpenBrowserAsync).toHaveBeenCalledWith(url);
      mockOpenBrowserAsync.mockClear();
    });
  });
});
