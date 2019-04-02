// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
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

  it('triggers `onSeek` callback every time when pressed if text is short', () => {
    const onSeekMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <TextMarker
        text="A word"
        onSeek={onSeekMock}
      />,
    );

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded if text is long', () => {
    const onSeekMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <TextMarker
        text="The text long enough to switch to collapsible state"
        onSeek={onSeekMock}
      />,
    );

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).not.toBeCalled();

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });
});
