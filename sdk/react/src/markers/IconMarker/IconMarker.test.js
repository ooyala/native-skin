// @flow

import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
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

  it('triggers `onSeek` callback every time when pressed if `imageUrl` is empty', () => {
    const onSeekMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl={undefined}
        onSeek={onSeekMock}
      />,
    );

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });

  it('triggers `onSeek` callback when pressed being expanded', () => {
    const onSeekMock = jest.fn();
    const testRenderer = TestRenderer.create(
      <IconMarker
        iconUrl="http://example.com/icon.png"
        imageUrl="http://example.com/image.png"
        onSeek={onSeekMock}
      />,
    );

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).not.toBeCalled();

    testRenderer.root.findByType(TouchableWithoutFeedback).props.onPress();

    expect(onSeekMock).toBeCalled();
  });
});
