// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import TextMarker from './TextMarker';

describe('TextMarker', () => {
  it('renders matching snapshot', () => {
    const testRenderer = TestRenderer.create(
      <TextMarker
        text="Hello, world"
        onSeek={() => undefined}
      />,
    );

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
