import React from 'react';
import { View, TextInput, StyleSheet, TextStyle, ViewStyle, TextInputProps } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  iconColor?: string;
  iconSize?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput | null>;
} & Omit<TextInputProps, 'style' | 'value' | 'onChangeText' | 'placeholder' | 'ref'>;

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  iconColor = '#8B7355',
  iconSize = 26,
  containerStyle,
  inputStyle,
  inputRef,
  ...textInputProps
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}> 
      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#8B7355"
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      <FontAwesome name="search" size={iconSize} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    marginRight: 12,
  },
});

export default SearchBar;


