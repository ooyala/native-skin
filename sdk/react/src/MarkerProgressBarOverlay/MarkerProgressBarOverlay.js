// @flow

import * as React from 'react';
import { View } from 'react-native';

import styles from './MarkerProgressBarOverlay.styles';
import type { Marker as MarkerType } from '../types/Marker';

type Props = {
  accentColor?: ?string,
  duration: number,
  marker: MarkerType,
};

const MarkerProgressBarOverlay = ({ accentColor, duration, marker }: Props) => {
  // Prevent rendering overlays for inappropriately configured markers.
  if ((marker.type === 'text' && !marker.text)
    || (marker.type === 'icon' && !marker.iconUrl && !marker.imageUrl)) {
    return null;
  }

  const style = {};

  style.left = (marker.start === 'start' ? 0 : `${marker.start / duration * 100}%`);

  if (marker.end) {
    style.right = (marker.end === 'end' ? 0 : `${100 - marker.end / duration * 100}%`);
  }

  if (marker.markerColor || accentColor) {
    style.backgroundColor = marker.markerColor || accentColor;
  }

  return <View style={[styles.root, style]} />;
};

MarkerProgressBarOverlay.defaultProps = {
  accentColor: undefined,
};

export default MarkerProgressBarOverlay;
