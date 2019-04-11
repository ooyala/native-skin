// @flow

import { shallow } from 'enzyme';
import React from 'react';

import Marker from './Marker';

describe('Marker', () => {
  it('renders marker of the text type matching snapshot', () => {
    const wrapper = shallow(
      <Marker
        duration={60}
        marker={{
          start: 'start',
          type: 'text',
          text: 'Hello, world!',
        }}
        onSeek={() => undefined}
        onTouch={() => undefined}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders marker of the icon type matching snapshot', () => {
    const wrapper = shallow(
      <Marker
        duration={60}
        marker={{
          iconUrl: 'http://example.com/icon.png',
          start: 'start',
          type: 'icon',
        }}
        onSeek={() => undefined}
        onTouch={() => undefined}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
