// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkerProgressBarOverlay from './MarkerProgressBarOverlay';

describe('MarkerProgressBarOverlay', () => {
  it('renders matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <MarkerProgressBarOverlay
        duration={60}
        marker={{
          start: 'start',
          type: 'text',
          text: 'Hello, world!',
        }}
      />,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
