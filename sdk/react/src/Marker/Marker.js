// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { MarkerType } from './Marker.type';
import styles from './Marker.styles';

type Props = {
  duration: number,
  marker: MarkerType,
};

const Marker = ({ duration, marker }: Props) => {
  const style = {
    left: marker.start === 'start' ? 0 : `${marker.start / duration * 100}%`,
  };

  if (marker.end) {
    style.right = marker.end === 'end' ? 0 : `${100 - marker.end / duration * 100}%`;
  }

  if (marker.color) {
    style.backgroundColor = marker.color;
  }

  return <View style={[styles.marker, style]} />;
};

export default Marker;
