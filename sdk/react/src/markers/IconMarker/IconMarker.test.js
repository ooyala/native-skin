// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import TestRenderer from 'react-test-renderer';

import IconMarker from './IconMarker';

describe('IconMarker', () => {
  it('renders matching snapshot', () => {
    const wrapper = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('does not render anything when URLs are empty', () => {
    const wrapper = TestRenderer.create(
      <IconMarker
        iconUrl={undefined}
        imageUrl={undefined}
        onSeek={() => undefined}
      />,
    );

    expect(wrapper.toJSON()).toBeNull();
  });

  it('triggers `onSeek` callback every time when pressed if `imageUrl` is empty', () => {
    const onSeekMock = jest.fn();
    const wrapper = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl={undefined}
        onSeek={onSeekMock}
      />,
    );

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded', () => {
    const onSeekMock = jest.fn();
    const wrapper = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={onSeekMock}
      />,
    );

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).not.toBeCalled();

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });
});
