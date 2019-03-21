// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import TextMarker from './TextMarker';

describe('TextMarker', () => {
  it('renders matching snapshot', () => {
    const tree = renderer.create(
      <TextMarker
        text="Hello, world"
        onSeek={() => undefined}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
