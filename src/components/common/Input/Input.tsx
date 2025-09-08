import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  isPassword?: boolean;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  variant = 'default',
  size = 'medium',
  isPassword = false,
  testID,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [styles.container, containerStyle];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    inputStyle,
  ];

  const handleRightIconPress = () => {
    if (isPassword) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (isPassword) {
      return isPasswordVisible ? 'eye-slash' : 'eye';
    }
    return rightIcon;
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={[styles.label, labelStyle]} testID={`${testID}-label`}>
          {label}
        </Text>
      )}

      <View style={inputContainerStyles}>
        {leftIcon && (
          <FontAwesome
            name={leftIcon as any}
            size={18}
            color={error ? '#FF6B6B' : isFocused ? '#FF8C42' : '#8B7355'}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...textInputProps}
          style={inputStyles}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={textInputProps.placeholderTextColor || '#8B7355'}
          testID={testID}
        />

        {(getRightIcon() || isPassword) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIcon}
            testID={`${testID}-right-icon`}
          >
            <FontAwesome
              name={getRightIcon() as any}
              size={18}
              color={error ? '#FF6B6B' : isFocused ? '#FF8C42' : '#8B7355'}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, errorStyle]} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  default: {
    backgroundColor: '#FFFFFF',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  filled: {
    backgroundColor: '#F5F5F5',
    borderColor: 'transparent',
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 20,
  },
  focused: {
    borderColor: '#FF8C42',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: '#FF6B6B',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    padding: 0, // Remove default padding
  },
  smallInput: {
    fontSize: 14,
  },
  mediumInput: {
    fontSize: 16,
  },
  largeInput: {
    fontSize: 18,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  leftIcon: {
    marginLeft: 4,
  },
  rightIcon: {
    padding: 4,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },
});
