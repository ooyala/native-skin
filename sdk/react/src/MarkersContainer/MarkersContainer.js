// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Marker, { type MarkerType } from '../Marker';
import styles from './MarkersContainer.styles';

type Props = {
  accentColor?: string,
  duration: number,
  markers: Array<MarkerType>,
  style?: StyleSheet.Styles,
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
