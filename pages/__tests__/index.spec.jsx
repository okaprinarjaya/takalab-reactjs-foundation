import React from 'react';
import { render } from '@testing-library/react';

import Home from '../index';

test('renders deploy link', () => {
  const { getByText } = render(<Home />);

  const linkElement = getByText(
    /Instantly deploy your Next\.js site to a public URL with ZEIT Now\./
  );

  expect(linkElement)
    .toBeInTheDocument();
});
