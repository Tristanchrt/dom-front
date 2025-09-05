import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import EditScreenInfo from '../EditScreenInfo';

test('renders instructional texts and external link', async () => {
  render(<EditScreenInfo path="/(tabs)/index.tsx" />);

  expect(screen.getByText('Open up the code for this screen:')).toBeTruthy();

  expect(screen.getByText('/(tabs)/index.tsx')).toBeTruthy();

  expect(
    screen.getByText(
      'Change any of the text, save the file, and your app will automatically update.',
    ),
  ).toBeTruthy();

  expect(
    screen.getByText("Tap here if your app doesn't automatically update after making changes"),
  ).toBeTruthy();
});
