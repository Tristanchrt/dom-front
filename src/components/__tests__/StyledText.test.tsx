import React from 'react';
import { render } from '@testing-library/react-native';
import { MonoText } from '../common/StyledText';

describe('StyledText Component', () => {
  describe('MonoText', () => {
    it('should render with default props', () => {
      const { getByText } = render(<MonoText>Test Text</MonoText>);
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('should apply SpaceMono font family', () => {
      const { getByText } = render(<MonoText>Mono Text</MonoText>);
      const textElement = getByText('Mono Text');
      // Style structure: [themeColor, [customStyle, fontFamily]]
      expect(textElement.props.style).toEqual([
        expect.objectContaining({ color: expect.any(String) }),
        expect.arrayContaining([
          expect.objectContaining({ fontFamily: 'SpaceMono' })
        ])
      ]);
    });

    it('should merge custom styles with SpaceMono font', () => {
      const customStyle = { fontSize: 18, color: 'red' };
      const { getByText } = render(
        <MonoText style={customStyle}>Styled Mono Text</MonoText>
      );
      const textElement = getByText('Styled Mono Text');
      // Style structure: [themeColor, [customStyle, fontFamily]]
      expect(textElement.props.style).toEqual([
        expect.objectContaining({ color: expect.any(String) }),
        expect.arrayContaining([
          customStyle,
          expect.objectContaining({ fontFamily: 'SpaceMono' })
        ])
      ]);
    });

    it('should pass through all Text props', () => {
      const { getByTestId } = render(
        <MonoText
          testID="mono-text"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Long text that should be truncated
        </MonoText>
      );
      const textElement = getByTestId('mono-text');
      expect(textElement.props.numberOfLines).toBe(2);
      expect(textElement.props.ellipsizeMode).toBe('tail');
    });

    it('should support light and dark theme colors', () => {
      const { getByText } = render(
        <MonoText lightColor="#000000" darkColor="#FFFFFF">
          Themed Mono Text
        </MonoText>
      );
      expect(getByText('Themed Mono Text')).toBeTruthy();
    });
  });
});
