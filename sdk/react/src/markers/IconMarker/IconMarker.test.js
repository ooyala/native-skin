// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import IconMarker from './IconMarker';

describe('IconMarker', () => {
  it('renders matching snapshot', () => {
    const tree = renderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={() => undefined}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('does not render with empty URLs', () => {
    const tree = renderer.create(
      <IconMarker
        iconUrl={undefined}
        imageUrl={undefined}
        onSeek={() => undefined}
      />,
    ).toJSON();

    expect(tree).toBeNull();
  });
});
