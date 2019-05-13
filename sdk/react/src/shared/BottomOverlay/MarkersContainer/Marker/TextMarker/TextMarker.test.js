// @flow

import { shallow } from 'enzyme';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import TextMarker from './TextMarker';

describe('TextMarker', () => {
  it('renders matching snapshot', () => {
    const wrapper = shallow(
      <TextMarker
        containerWidth={100}
        leftPosition={0}
        text="Hello, world"
        onSeek={() => undefined}
        onTouch={() => undefined}
      />,
    );

    expect(wrapper)
      .toMatchSnapshot();
  });

  it('triggers `onSeek` callback every time when pressed if text is short', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <TextMarker
        containerWidth={100}
        leftPosition={0}
        text="A word"
        onSeek={onSeekMock}
        onTouch={() => undefined}
      />,
    );

    wrapper.find(TouchableWithoutFeedback)
      .simulate('press');

    expect(onSeekMock)
      .toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded if text is long', () => {
    const onSeekMock = jest.fn();
    const wrapper = shallow(
      <TextMarker
        containerWidth={100}
        leftPosition={0}
        text="The text long enough to switch to collapsible state"
        onSeek={onSeekMock}
        onTouch={() => undefined}
      />,
    );

    wrapper.find(TouchableWithoutFeedback)
      .simulate('press');

    expect(onSeekMock)
      .not
      .toBeCalled();

    wrapper.find(TouchableWithoutFeedback)
      .simulate('press');

    expect(onSeekMock)
      .toBeCalled();
  });

  it('triggers `onTouch` callback every time when pressed', () => {
    const onTouchMock = jest.fn();
    const wrapper = shallow(
      <TextMarker
        containerWidth={100}
        leftPosition={0}
        text="A word"
        onSeek={() => undefined}
        onTouch={onTouchMock}
      />,
    );

    wrapper.find(TouchableWithoutFeedback).simulate('press');

    expect(onTouchMock).toBeCalled();
  });
});
