// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkersProgressBarOverlayContainer from './MarkersProgressBarOverlayContainer';

describe('MarkersProgressBarOverlayContainer', () => {
  it('renders matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <MarkersProgressBarOverlayContainer
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
      <MarkersProgressBarOverlayContainer
        duration={60}
        markers={[]}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toBeNull();
  });
});
