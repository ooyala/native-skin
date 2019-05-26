// @flow

import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import IconMarker from './IconMarker';
import TextMarker from './TextMarker';
import type { Marker as MarkerType } from '../../../../types/Markers';

type Props = {
  accentColor?: string,
  containerWidth: number,
  duration: number,
  marker: MarkerType,
  onSeek: number => void,
  onTouch: () => void,
  style?: ViewStyleProp,
};

const Marker = ({
  accentColor, containerWidth, duration, marker, onSeek, onTouch, style,
}: Props) => {
  const start = (marker.start === 'start' ? 0 : marker.start);
  const left = start / duration * containerWidth;

  if (marker.type === 'text' && marker.text) {
    return (
      <TextMarker
        backgroundColor={marker.backgroundColor || accentColor}
        containerWidth={containerWidth}
        leftPosition={left}
        onSeek={() => onSeek(start)}
        onTouch={onTouch}
        style={style}
        text={marker.text}
      />
    );
  }

  if (marker.type === 'icon') {
    return (
      <IconMarker
        backgroundColor={marker.backgroundColor}
        containerWidth={containerWidth}
        iconUrl={marker.iconUrl}
        imageUrl={marker.imageUrl}
        leftPosition={left}
        onSeek={() => onSeek(start)}
        onTouch={onTouch}
        style={style}
        touchColor={marker.markerColor || accentColor}
      />
    );
  }

  return null;
};

Marker.defaultProps = {
  accentColor: undefined,
  style: undefined,
};

export default Marker;
