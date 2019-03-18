// @flow

import * as React from 'react';
import { Image, Text, View } from 'react-native';

import type { Marker as MarkerType } from '../types/Marker';

import styles from './Marker.styles';

type Props = {
  accentColor?: string,
  duration: number,
  isExpanded?: boolean,
  marker: MarkerType,
};

const Marker = ({
  accentColor, duration, isExpanded, marker,
}: Props) => {
  if (marker.type === 'text' && !marker.text) {
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

  let addOn = null;

  if (marker.type === 'text' && marker.text) {
    let { text } = marker;

    if (!isExpanded && text.length > 80) {
      text = text.slice(0, 80).concat('...');
    }

    addOn = <Text style={styles.text}>{text}</Text>;
  } else if (marker.type === 'icon') {
    let image = marker.iconUrl;

    // If the marker is expanded and there is `imageUrl`, we have to use it.
    if (isExpanded && marker.imageUrl) {
      image = marker.imageUrl;
    }

    // Image can still be absent.
    if (image) {
      addOn = <Image source={{ uri: image }} style={styles.icon} />;
    }
  }

  return (
    <View style={[styles.root, style]}>
      {addOn}
    </View>
  );
};

Marker.defaultProps = {
  accentColor: undefined,
  isExpanded: false,
};

export default Marker;
