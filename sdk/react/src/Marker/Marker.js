// @flow

import * as React from 'react';
import { View } from 'react-native';

import IconMarker from '../IconMarker';
import styles from './Marker.styles';
import TextMarker from '../TextMarker';
import type { Marker as MarkerType } from '../types/Marker';

type Props = {
  accentColor?: ?string,
  duration: number,
  marker: MarkerType,
  onSeek: number => void,
};

const Marker = ({
  accentColor, duration, marker, onSeek,
}: Props) => {
  if (marker.type === 'text' && !marker.text) {
    return null;
  }

  const start = (marker.start === 'start' ? 0 : marker.start);
  const style = {};

  style.left = `${start / duration * 100}%`;

  if (marker.end) {
    style.right = (marker.end === 'end' ? 0 : `${100 - marker.end / duration * 100}%`);
  }

  if (marker.markerColor || accentColor) {
    style.backgroundColor = marker.markerColor || accentColor;
  }

  let addOn = null;

  if (marker.type === 'text' && marker.text) {
    addOn = <TextMarker onSeek={() => onSeek(start)} text={marker.text} />;
  } else if (marker.type === 'icon') {
    addOn = <IconMarker iconUrl={marker.iconUrl} imageUrl={marker.imageUrl} onSeek={() => onSeek(start)} />;
  }

  return (
    <View style={[styles.root, style]}>
      {addOn}
    </View>
  );
};

Marker.defaultProps = {
  accentColor: undefined,
};

export default Marker;
