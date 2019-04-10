// @flow

import * as React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import IconMarker from './IconMarker';
import TextMarker from './TextMarker';
import type { Marker as MarkerType } from '../../../../types/Markers';

type Props = {
  accentColor?: ?string,
  duration: number,
  marker: MarkerType,
  onSeek: number => void,
  onTouch: () => void,
  style?: ViewStyleProp,
};

const Marker = ({
  accentColor, duration, marker, onSeek, onTouch, style,
}: Props) => {
  const start = (marker.start === 'start' ? 0 : marker.start);
  const left = `${start / duration * 100}%`;

  if (marker.type === 'text' && marker.text) {
    return (
      <TextMarker
        backgroundColor={marker.backgroundColor || accentColor}
        onSeek={() => onSeek(start)}
        onTouch={onTouch}
        style={[
          style,
          { left },
        ]}
        text={marker.text}
      />
    );
  }

  if (marker.type === 'icon') {
    return (
      <IconMarker
        backgroundColor={marker.backgroundColor}
        iconUrl={marker.iconUrl}
        imageUrl={marker.imageUrl}
        onSeek={() => onSeek(start)}
        onTouch={onTouch}
        style={[
          style,
          { left },
        ]}
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
