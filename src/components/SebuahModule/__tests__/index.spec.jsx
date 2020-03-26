import React from 'react';
import { render } from '@testing-library/react';

import SebuahModule from '../index';

test('render gue', () => {
  const { getByText } = render(<SebuahModule />);

  const text = getByText(/Gue sebuah module/);

  expect(text).toBeInTheDocument();
});
