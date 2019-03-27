// @flow

import * as React from 'react';
import { View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import MarkerProgressBarOverlay from '../MarkerProgressBarOverlay';
import styles from './MarkersProgressBarOverlayContainer.styles';
import type { Marker as MarkerType } from '../../types/Marker';

type Props = {
  accentColor?: ?string,
  duration: number,
  markers: Array<MarkerType>,
  style?: ViewStyleProp,
};

const MarkersProgressBarOverlayContainer = ({
  accentColor, duration, markers, style,
}: Props) => (
  markers.length > 0
    ? (
      <View style={[styles.root, style]}>
        {markers.map((marker, index) => (
          <MarkerProgressBarOverlay
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

MarkersProgressBarOverlayContainer.defaultProps = {
  accentColor: undefined,
  style: undefined,
};

export default MarkersProgressBarOverlayContainer;
