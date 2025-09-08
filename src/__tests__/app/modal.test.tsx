import React from 'react';
import { render } from '@testing-library/react-native';
import ModalScreen from '@/app/modal';

describe('ModalScreen', () => {
  it('renders title and content', () => {
    const { getByText } = render(<ModalScreen />);
    expect(getByText('Modal')).toBeTruthy();
    expect(getByText(/app\/modal\.tsx/)).toBeTruthy();
  });
});
