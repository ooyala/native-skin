// @flow

import * as React from 'react';

import IconMarker from '../IconMarker';
import TextMarker from '../TextMarker';
import type { Marker as MarkerType } from '../types/Marker';

type Props = {
  duration: number,
  marker: MarkerType,
  onSeek: number => void,
};

const Marker = ({ duration, marker, onSeek }: Props) => {
  const start = (marker.start === 'start' ? 0 : marker.start);
  const left = `${start / duration * 100}%`;

  if (marker.type === 'text' && marker.text) {
    return (
      <TextMarker
        onSeek={() => onSeek(start)}
        style={{ left }}
        text={marker.text}
      />
    );
  }

  if (marker.type === 'icon') {
    return (
      <IconMarker
        iconUrl={marker.iconUrl}
        imageUrl={marker.imageUrl}
        onSeek={() => onSeek(start)}
        style={{ left }}
      />
    );
  }

  return null;
};

export default Marker;
