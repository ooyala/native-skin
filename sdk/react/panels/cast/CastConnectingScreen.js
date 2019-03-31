import PropTypes from 'prop-types';

import React from 'react';
import {
  ActivityIndicator, Animated, Text, TouchableOpacity,
} from 'react-native';

import Utils from '../../utils';
import castConnectingStyles from '../style/CastConnectingStyles.json';

const styles = Utils.getStyles(castConnectingStyles);

export default class CastConnectingScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onDisconnect: PropTypes.func.isRequired,
  };

  static renderCircleIndicator() {
    return (
      <ActivityIndicator
        size="large"
        color={styles.circleIndicator.color}
        style={styles.circleIndicator}
      />
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

  static renderConnectingText() {
    return (
      <Text style={styles.connectingTextStyle}>
        {'Connecting...'}
      </Text>
    );
  }

  render() {
    const { height, width } = this.props;

    return (
      <Animated.View style={[styles.fullscreenContainer, { height, width }]}>
        {this.constructor.renderCircleIndicator()}
        {this.constructor.renderConnectingText()}
        {this.renderTouchableCancelText()}
      </Animated.View>
    );
  }
}
