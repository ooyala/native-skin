// flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Marker, { type MarkerType } from '../Marker';
import styles from './MarkersList.styles';

type Props = {
  duration: number,
  markers: Array<MarkerType>,
  style?: StyleSheet.Styles,
};

const MarkersList = ({ duration, markers, style }: Props) => (
  markers.length > 0
    ? (
      <View style={[styles.root, style]}>
        {markers.map(marker => <Marker duration={duration} marker={marker} />)}
      </View>
    )
    : null
);

MarkersList.defaultProps = {
  style: undefined,
};

export default MarkersList;
