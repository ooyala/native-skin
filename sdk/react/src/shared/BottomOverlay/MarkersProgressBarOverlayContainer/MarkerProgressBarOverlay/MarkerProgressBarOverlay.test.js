// @flow

import { shallow } from 'enzyme';
import React from 'react';

import MarkerProgressBarOverlay from './MarkerProgressBarOverlay';

describe('MarkerProgressBarOverlay', () => {
  it('renders matching snapshot', () => {
    const wrapper = shallow(
      <MarkerProgressBarOverlay
        duration={60}
        marker={{
          start: 'start',
          type: 'text',
          text: 'Hello, world!',
        }}
      />,
    );

    expect(wrapper)
      .toMatchSnapshot();
  });
});
