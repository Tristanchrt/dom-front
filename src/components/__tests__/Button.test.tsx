import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button, ButtonProps } from '../common/Button/Button';
import { ActivityIndicator } from 'react-native';


describe('Button Component', () => {
  const defaultProps: ButtonProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByText, getByRole } = render(<Button {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <Button {...defaultProps} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <Button {...defaultProps} onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <Button {...defaultProps} onPress={mockOnPress} loading />
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading is true', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button {...defaultProps} loading />
    );
    
    expect(queryByText('Test Button')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy(); 
  });

  describe('Variants', () => {
    it('should render primary variant correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} variant="primary" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ backgroundColor: '#FF8C42' })
      );
    });

    it('should render secondary variant correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} variant="secondary" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ backgroundColor: '#F5F5F5' })
      );
    });

    it('should render outline variant correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} variant="outline" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#FF8C42'
        })
      );
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} size="small" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ minHeight: 36 })
      );
    });

    it('should render medium size correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} size="medium" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ minHeight: 44 })
      );
    });

    it('should render large size correctly', () => {
      const { getByRole } = render(
        <Button {...defaultProps} size="large" />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toEqual(
        expect.objectContaining({ minHeight: 52 })
      );
    });
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'blue' };
    
    const { getByRole, getByText } = render(
      <Button 
        {...defaultProps} 
        style={customStyle}
        textStyle={customTextStyle}
      />
    );
    
    const button = getByRole('button');
    const text = getByText('Test Button');
    
    // Button styles are flattened to objects, text styles remain as arrays
    expect(button.props.style).toEqual(
      expect.objectContaining(customStyle)
    );
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customTextStyle)])
    );
  });

  it('should have correct accessibility attributes', () => {
    const { getByRole } = render(<Button {...defaultProps} />);
    
    const button = getByRole('button');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityState).toEqual({ disabled: false });
  });

  it('should have correct accessibility state when disabled', () => {
    const { getByRole } = render(<Button {...defaultProps} disabled />);
    
    const button = getByRole('button');
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });

  it('should render with testID when provided', () => {
    const { getByTestId } = render(
      <Button {...defaultProps} testID="test-button" />
    );
    
    expect(getByTestId('test-button')).toBeTruthy();
  });
});
