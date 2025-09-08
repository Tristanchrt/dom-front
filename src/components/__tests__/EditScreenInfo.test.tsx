import React from 'react';
import { render } from '@testing-library/react-native';
import EditScreenInfo from '../specific/EditScreenInfo';

// Mock the themed components
jest.mock('../common/Themed', () => ({
  Text: ({ children, ...props }: any) => {
    const MockText = require('react-native').Text;
    return <MockText {...props}>{children}</MockText>;
  },
  View: ({ children, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView {...props}>{children}</MockView>;
  },
}));

// Mock StyledText
jest.mock('../common/StyledText', () => ({
  MonoText: ({ children, ...props }: any) => {
    const MockText = require('react-native').Text;
    return <MockText {...props}>{children}</MockText>;
  },
}));

// Mock ExternalLink
jest.mock('../specific/ExternalLink', () => ({
  ExternalLink: ({ children, ...props }: any) => {
    const MockTouchable = require('react-native').TouchableOpacity;
    return <MockTouchable {...props}>{children}</MockTouchable>;
  },
}));

// Mock Colors
jest.mock('@/constants/Colors', () => ({
  light: {
    tint: '#FF8C42',
  },
}));

describe('EditScreenInfo Component', () => {
  const mockPath = 'app/(tabs)/index.tsx';

  it('should render with provided path', () => {
    const { getByText } = render(<EditScreenInfo path={mockPath} />);

    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(getByText(mockPath)).toBeTruthy();
    expect(
      getByText('Change any of the text, save the file, and your app will automatically update.'),
    ).toBeTruthy();
  });

  it('should display help text and link', () => {
    const { getByText } = render(<EditScreenInfo path={mockPath} />);

    expect(
      getByText("Tap here if your app doesn't automatically update after making changes"),
    ).toBeTruthy();
  });

  it('should render with different paths', () => {
    const testPaths = [
      'app/login.tsx',
      'app/(tabs)/profile.tsx',
      'components/Button.tsx',
      'src/screens/HomeScreen.tsx',
    ];

    testPaths.forEach((path) => {
      const { getByText } = render(<EditScreenInfo path={path} />);
      expect(getByText(path)).toBeTruthy();
    });
  });

  it('should handle empty path', () => {
    const { getByText } = render(<EditScreenInfo path="" />);

    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(getByText('')).toBeTruthy(); // Empty path should still render
  });

  it('should handle long paths', () => {
    const longPath = 'src/components/complex/nested/very/deep/SomeComplexComponent.tsx';
    const { getByText } = render(<EditScreenInfo path={longPath} />);

    expect(getByText(longPath)).toBeTruthy();
  });

  it('should render all sections', () => {
    const { getByText } = render(<EditScreenInfo path={mockPath} />);

    // Check instruction sections
    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(
      getByText('Change any of the text, save the file, and your app will automatically update.'),
    ).toBeTruthy();

    // Check help section
    expect(
      getByText("Tap here if your app doesn't automatically update after making changes"),
    ).toBeTruthy();
  });

  it('should render with proper accessibility', () => {
    const { getByText } = render(<EditScreenInfo path={mockPath} />);

    // The component should render text elements that are accessible
    const pathText = getByText(mockPath);
    expect(pathText).toBeTruthy();

    const instructionText = getByText('Open up the code for this screen:');
    expect(instructionText).toBeTruthy();
  });
});
