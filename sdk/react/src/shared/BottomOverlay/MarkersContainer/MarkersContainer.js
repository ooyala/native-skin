// @flow

import React from 'react';
import { Animated } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import Marker from './Marker';
import styles from './MarkersContainer.styles';
import type { Marker as MarkerType } from '../../../types/Markers';

type Props = {
  accentColor?: ?string,
  duration: number,
  markers: Array<MarkerType>,
  onSeek: number => void,
  style?: ViewStyleProp,
};

const MarkersContainer = ({
  accentColor, duration, markers, onSeek, style,
}: Props) => (
  markers.length > 0
    ? (
      // Path pointer events through the View to its children.
      <Animated.View pointerEvents="box-none" style={[styles.root, style]}>
        {markers.map((marker, index) => (
          <Marker
            accentColor={accentColor}
            duration={duration}
            key={index} // eslint-disable-line react/no-array-index-key
            marker={marker}
            onSeek={onSeek}
          />
        ))}
      </Animated.View>
    )
    : null
);

MarkersContainer.defaultProps = {
  accentColor: undefined,
  style: undefined,
};

export default MarkersContainer;
