// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkersContainer from './MarkersContainer';

describe('MarkersContainer', () => {
  it('renders matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <MarkersContainer
        duration={60}
        markers={[
          {
            start: 'start',
            type: 'text',
            text: 'Hello, world!',
          },
          {
            iconUrl: 'http://example.com/icon.png',
            start: 'start',
            type: 'icon',
          },
        ]}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('does not render anything when markers array is empty', () => {
    const wrapper = TestRenderer.create(
      <MarkersContainer
        duration={60}
        markers={[]}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toBeNull();
  });
});
