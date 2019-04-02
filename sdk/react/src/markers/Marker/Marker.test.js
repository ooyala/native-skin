// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import Marker from './Marker';

describe('Marker', () => {
  it('renders marker of the text type matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <Marker
        duration={60}
        marker={{
          start: 'start',
          type: 'text',
          text: 'Hello, world!',
        }}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders marker of the icon type matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <Marker
        duration={60}
        marker={{
          iconUrl: 'http://example.com/icon.png',
          start: 'start',
          type: 'icon',
        }}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
