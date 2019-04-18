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
  width: number,
};

type State = {
  lastTouchedIndex?: number,
};

export default class MarkersContainer extends React.Component<Props, State> {
  static defaultProps = {
    accentColor: undefined,
    style: undefined,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      lastTouchedIndex: undefined,
    };
  }

  handleTouch(index: number) {
    this.setState({ lastTouchedIndex: index });
  }

  render() {
    const {
      accentColor, duration, markers, onSeek, style, width,
    } = this.props;
    const { lastTouchedIndex } = this.state;

    if (markers.length === 0) {
      return null;
    }

    return (
      // Path pointer events through the View to its children.
      <Animated.View pointerEvents="box-none" style={[styles.root, { width }, style]}>
        {markers.map((marker, index) => (
          <Marker
            accentColor={accentColor}
            containerWidth={width}
            duration={duration}
            key={index} // eslint-disable-line react/no-array-index-key
            marker={marker}
            onSeek={onSeek}
            onTouch={() => this.handleTouch(index)}
            style={{
              // If the marker has been touched, then raise it over the others, otherwise the former should overlap the
              // latter.
              zIndex: lastTouchedIndex === index ? markers.length : markers.length - index,
            }}
          />
        ))}
      </Animated.View>
    );
  }
}
