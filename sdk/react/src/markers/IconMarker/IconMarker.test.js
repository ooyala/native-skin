// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import IconMarker from './IconMarker';

describe('IconMarker', () => {
  it('renders matching snapshot', () => {
    const testRenderer = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={() => undefined}
      />,
    );

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('does not render anything when URLs are empty', () => {
    const testRenderer = TestRenderer.create(
      <IconMarker
        iconUrl={undefined}
        imageUrl={undefined}
        onSeek={() => undefined}
      />,
    );

    expect(testRenderer.toJSON()).toBeNull();
  });
});
