// @flow

import * as React from 'react';
import { View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import Marker from '../Marker';
import type { Marker as MarkerType } from '../types/Marker';

import styles from './MarkersContainer.styles';

type Props = {
  accentColor?: ?string,
  duration: number,
  markers: Array<MarkerType>,
  style?: ViewStyleProp,
};

const MarkersContainer = ({
  accentColor, duration, markers, style,
}: Props) => (
  markers.length > 0
    ? (
      <View style={[styles.root, style]}>
        {markers.map((marker, index) => (
          <Marker
            accentColor={accentColor}
            duration={duration}
            key={index} // eslint-disable-line react/no-array-index-key
            marker={marker}
          />
        ))}
      </View>
    )
    : null
);

MarkersContainer.defaultProps = {
  accentColor: undefined,
  style: undefined,
};

export default MarkersContainer;
