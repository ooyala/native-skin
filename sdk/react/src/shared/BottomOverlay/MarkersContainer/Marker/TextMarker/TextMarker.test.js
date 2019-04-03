// @flow

import { shallow } from 'enzyme';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import TextMarker from './TextMarker';

describe('TextMarker', () => {
  it('renders matching snapshot', () => {
    const wrapper = shallow(
      <TextMarker
        text="Hello, world"
        onSeek={() => undefined}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('triggers `onSeek` callback every time when pressed if text is short', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <TextMarker
        text="A word"
        onSeek={onSeekMock}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded if text is long', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <TextMarker
        text="The text long enough to switch to collapsible state"
        onSeek={onSeekMock}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).not.toBeCalled();

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onSeekMock).toBeCalled();
  });
});
