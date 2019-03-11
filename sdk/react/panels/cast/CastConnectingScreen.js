import PropTypes from 'prop-types';

import React from 'react';
import {
  ActivityIndicator, Animated, Text, TouchableOpacity,
} from 'react-native';

const Utils = require('../../utils');
const styles = Utils.getStyles(require('../style/CastConnectingStyles.json'));

export default class CastConnectingScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onDisconnect: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { height } = this.props;
    this.state = {
      translateY: new Animated.Value(height),
      opacity: new Animated.Value(2),
      selectedID: -1,
    };
  }

  componentDidMount() {
    const { height } = this.props;
    const { translateY, opacity } = this.state;

    translateY.setValue(height);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(
        translateY, {
          toValue: 0,
          duration: 700,
          delay: 0,
        },
      ),
      Animated.timing(
        opacity, {
          toValue: 1,
          duration: 500,
          delay: 0,
        },
      ),
    ])
      .start();
  }

  static renderCircleIndicator() {
    return (
      <ActivityIndicator
        size={120}
        color={styles.circleIndicatorStyle.color}
        style={[styles.circleIndicatorStyle]}
      />
    );
  }

  renderTouchableCancelText() {
    const { onDisconnect } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          onDisconnect();
        }}
      >
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
      <Animated.View
        style={[styles.fullscreenContainer, {
          height,
          width,
        }]}
      >
        {CastConnectingScreen.renderCircleIndicator()}
        {this.constructor.renderConnectingText()}
        {this.renderTouchableCancelText()}
      </Animated.View>
    );
  }
}
