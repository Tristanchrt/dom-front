import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View, useThemeColor } from '../common/Themed';
import * as useColorSchemeModule from '../../hooks/useColorScheme';

// Mock the useColorScheme hook
jest.mock('../../hooks/useColorScheme');
const mockUseColorScheme = useColorSchemeModule.useColorScheme as jest.MockedFunction<
  typeof useColorSchemeModule.useColorScheme
>;

// Mock Colors
jest.mock('@/constants/Colors', () => ({
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#FF8C42',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#FF8C42',
  },
}));

describe('Themed Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useThemeColor', () => {
    it('should return light color when theme is light', () => {
      mockUseColorScheme.mockReturnValue('light');
      const color = useThemeColor({}, 'text');
      expect(color).toBe('#000000');
    });

    it('should return dark color when theme is dark', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const color = useThemeColor({}, 'text');
      expect(color).toBe('#FFFFFF');
    });

    it('should return custom light color when provided', () => {
      mockUseColorScheme.mockReturnValue('light');
      const color = useThemeColor({ light: '#FF0000' }, 'text');
      expect(color).toBe('#FF0000');
    });

    it('should return custom dark color when provided', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const color = useThemeColor({ dark: '#00FF00' }, 'text');
      expect(color).toBe('#00FF00');
    });

    it('should fallback to default when theme is null', () => {
      mockUseColorScheme.mockReturnValue(null);
      const color = useThemeColor({}, 'text');
      expect(color).toBe('#000000'); // Falls back to light theme
    });
  });

  describe('Text Component', () => {
    it('should render with default theme colors', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByText } = render(<Text>Test Text</Text>);
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('should apply custom light color', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByText } = render(<Text lightColor="#FF0000">Colored Text</Text>);
      const textElement = getByText('Colored Text');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#FF0000' })]),
      );
    });

    it('should apply custom dark color', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const { getByText } = render(<Text darkColor="#00FF00">Dark Colored Text</Text>);
      const textElement = getByText('Dark Colored Text');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#00FF00' })]),
      );
    });

    it('should merge custom styles', () => {
      mockUseColorScheme.mockReturnValue('light');
      const customStyle = { fontSize: 18 };
      const { getByText } = render(<Text style={customStyle}>Styled Text</Text>);
      const textElement = getByText('Styled Text');
      expect(textElement.props.style).toEqual(expect.arrayContaining([customStyle]));
    });

    it('should handle undefined colors gracefully', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByText } = render(<Text>Default Text</Text>);
      expect(getByText('Default Text')).toBeTruthy();
    });
  });

  describe('View Component', () => {
    it('should render with default theme background', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByTestId } = render(
        <View testID="themed-view">
          <Text>Content</Text>
        </View>,
      );
      expect(getByTestId('themed-view')).toBeTruthy();
    });

    it('should apply custom light background color', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByTestId } = render(
        <View testID="light-view" lightColor="#FF0000">
          <Text>Content</Text>
        </View>,
      );
      const viewElement = getByTestId('light-view');
      expect(viewElement.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: '#FF0000' })]),
      );
    });

    it('should apply custom dark background color', () => {
      mockUseColorScheme.mockReturnValue('dark');
      const { getByTestId } = render(
        <View testID="dark-view" darkColor="#00FF00">
          <Text>Content</Text>
        </View>,
      );
      const viewElement = getByTestId('dark-view');
      expect(viewElement.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: '#00FF00' })]),
      );
    });

    it('should handle undefined colors gracefully', () => {
      mockUseColorScheme.mockReturnValue('light');
      const { getByTestId } = render(
        <View testID="default-view">
          <Text>Content</Text>
        </View>,
      );
      expect(getByTestId('default-view')).toBeTruthy();
    });
  });
});
