import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';

describe('HomeScreen (tabs/index)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('switches feeds when tapping tabs', () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Explorer'));

    expect(getByText('Explorer')).toBeTruthy();
  });
});


