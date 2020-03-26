import React from 'react';
import { render } from '@testing-library/react';

import Nyukro from '../index';

test('render gue', () => {
  const launchuxes = [
    {
      id: '1',
      site: 'Rocket Falcon'
    }
  ];

  const { getByText } = render(<Nyukro launchuxes={launchuxes} />);

  const text = getByText(/Rocket Falcon/);

  expect(text).toBeInTheDocument();
});
