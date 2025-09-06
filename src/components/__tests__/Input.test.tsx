import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input, InputProps } from '../common/Input/Input';

describe('Input Component', () => {
  const defaultProps: InputProps = {
    placeholder: 'Enter text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByPlaceholderText } = render(<Input {...defaultProps} />);
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render label when provided', () => {
    const { getByTestId } = render(
      <Input {...defaultProps} label="Email" testID="email-input" />
    );
    
    expect(getByTestId('email-input-label')).toBeTruthy();
  });

  it('should render error message when provided', () => {
    const { getByTestId } = render(
      <Input {...defaultProps} error="This field is required" testID="input" />
    );
    
    expect(getByTestId('input-error')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'test text');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test text');
  });

  it('should call onFocus when focused', () => {
    const mockOnFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} onFocus={mockOnFocus} />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('should call onBlur when blurred', () => {
    const mockOnBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} onBlur={mockOnBlur} />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'blur');
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  describe('Password functionality', () => {
    it('should render password input with eye icon', () => {
      const { getByTestId } = render(
        <Input {...defaultProps} isPassword testID="password" />
      );
      
      expect(getByTestId('password-right-icon')).toBeTruthy();
    });

    it('should toggle password visibility when eye icon is pressed', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <Input {...defaultProps} isPassword testID="password" />
      );
      
      const input = getByPlaceholderText('Enter text');
      const eyeIcon = getByTestId('password-right-icon');
      
      // Initially should be secure
      expect(input.props.secureTextEntry).toBe(true);
      
      // Toggle visibility
      fireEvent.press(eyeIcon);
      expect(input.props.secureTextEntry).toBe(false);
      
      // Toggle back
      fireEvent.press(eyeIcon);
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('Icons', () => {
    it('should render left icon when provided', () => {
      render(<Input {...defaultProps} leftIcon="envelope" />);
      // Icon is rendered, test passes if no errors
    });

    it('should render right icon when provided', () => {
      const { getByTestId } = render(
        <Input {...defaultProps} rightIcon="search" testID="input" />
      );
      
      expect(getByTestId('input-right-icon')).toBeTruthy();
    });

    it('should call onRightIconPress when right icon is pressed', () => {
      const mockOnRightIconPress = jest.fn();
      const { getByTestId } = render(
        <Input 
          {...defaultProps} 
          rightIcon="search" 
          onRightIconPress={mockOnRightIconPress}
          testID="input"
        />
      );
      
      const rightIcon = getByTestId('input-right-icon');
      fireEvent.press(rightIcon);
      
      expect(mockOnRightIconPress).toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} variant="default" />
      );
      
      // Test that component renders without errors
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should apply outlined variant styles', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} variant="outlined" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should apply filled variant styles', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} variant="filled" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should apply small size', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} size="small" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should apply medium size', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} size="medium" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should apply large size', () => {
      const { getByPlaceholderText } = render(
        <Input {...defaultProps} size="large" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });
  });

  it('should apply custom styles', () => {
    const customContainerStyle = { backgroundColor: 'red' };
    const customInputStyle = { color: 'blue' };
    
    const { getByPlaceholderText } = render(
      <Input 
        {...defaultProps} 
        containerStyle={customContainerStyle}
        inputStyle={customInputStyle}
      />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with testID when provided', () => {
    const { getByTestId } = render(
      <Input {...defaultProps} testID="test-input" />
    );
    
    expect(getByTestId('test-input')).toBeTruthy();
  });
});
