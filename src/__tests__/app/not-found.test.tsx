import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotFoundScreen from '@/app/+not-found';

describe('NotFoundScreen', () => {
  it("renders title and link to home", () => {
    const { getByText } = render(<NotFoundScreen />);
    expect(getByText("This screen doesn't exist.")).toBeTruthy();
    expect(getByText('Go to home screen!')).toBeTruthy();
  });
});


