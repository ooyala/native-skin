'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {Animated, Text, View} from 'react-native';

const Log = require('../../log');
const Utils = require('../../utils');
const styles = Utils.getStyles(require('../style/castScreenStyles.json'));

class CastDisconnectingScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
  };

  componentWillMount() {
    this.state = {
      translateY: new Animated.Value(this.props.height),
      opacity: new Animated.Value(2),
      selectedID: -1
    };
  }

  componentDidMount() {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);

    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: "#00ff2a", flexDirection: 'column'}}>
        <Text> Disconnecting! </Text>
        <Text> Disconnecting! </Text>
        <Text> Disconnecting! </Text>
        <Text> Disconnecting! </Text>
        <Text> Disconnecting! </Text>
        <Text> Disconnecting! </Text>
      </View>
    );
  }
}

module.exports = CastDisconnectingScreen;
