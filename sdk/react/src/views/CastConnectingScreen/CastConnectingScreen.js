// @flow

import React from 'react';
import {
  ActivityIndicator, Animated, Text, TouchableOpacity,
} from 'react-native';

import styles from './CastConnectingScreen.styles';

type Props = {
  height: number,
  width: number,
  onDisconnect: () => void,
};

export default class CastConnectingScreen extends React.Component<Props> {
  static renderCircleIndicator() {
    return (
      <ActivityIndicator
        size="large"
        color={styles.circleIndicator.color}
        style={styles.circleIndicator}
      />
    );
  }

  static renderConnectingText() {
    return (
      <Text style={styles.connectingTextStyle}>
        {'Connecting...'}
      </Text>
    );
  }

  renderTouchableCancelText() {
    const { onDisconnect } = this.props;

    return (
      <TouchableOpacity onPress={() => onDisconnect()}>
        <Text style={[styles.cancelTextStyle]}>
          {'Cancel'}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { height, width } = this.props;

    return (
      <Animated.View style={[styles.fullscreenContainer,
        {
          height,
          width,
        }]}
      >
        {this.constructor.renderCircleIndicator()}
        {this.constructor.renderConnectingText()}
        {this.renderTouchableCancelText()}
      </Animated.View>
    );
  }
}
