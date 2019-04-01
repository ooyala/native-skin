// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import MarkersContainer from './MarkersContainer';

describe('MarkersContainer', () => {
  it('renders matching snapshot', () => {
    const testRenderer = TestRenderer.create(
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

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('does not render anything when markers array is empty', () => {
    const testRenderer = TestRenderer.create(
      <MarkersContainer
        duration={60}
        markers={[]}
        onSeek={() => undefined}
      />,
    );

    expect(testRenderer.toJSON()).toBeNull();
  });
});
