// @flow

import { shallow } from 'enzyme';
import React from 'react';

import MarkersContainer from './MarkersContainer';

describe('MarkersContainer', () => {
  it('renders matching snapshot', () => {
    const wrapper = shallow(
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
        width={100}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('does not render anything when markers array is empty', () => {
    const wrapper = shallow(
      <MarkersContainer
        duration={60}
        markers={[]}
        onSeek={() => undefined}
        width={100}
      />,
    );

    expect(wrapper).toEqual({});
  });
});
