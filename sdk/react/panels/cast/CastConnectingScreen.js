'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {ActivityIndicator, Animated, Text, TouchableOpacity} from 'react-native';

const Utils = require('../../utils');
const styles = Utils.getStyles(require('../style/CastConnectingStyles.json'));

class CastConnectingScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDisconnect: PropTypes.func,
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
        this.state.translateY, {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity, {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  render() {
    return (
      <Animated.View style={[styles.fullscreenContainer, {
        height: this.props.height,
        width: this.props.width,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }]}>
        <ActivityIndicator
          size={120}
          color='white'
          style={{
            paddingBottom: 65,
            paddingTop: 100
          }}/>
        <Text style={{
          fontFamily: "Roboto",
          color: "white",
          fontSize: 18,
          paddingBottom: 20
        }}> {"Connecting..."} </Text>
        <TouchableOpacity
          onPress={() => {
            this.props.onDisconnect();
          }}>
          <Text style={{
            fontFamily: "Roboto",
            fontSize: 16,
            borderWidth: 0.8,
            borderColor: 'white',
            borderRadius: 4,
            backgroundColor: 'transparent',
            color: 'white',
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 10,
            paddingBottom: 10
          }}>
            {"Cancel"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

module.exports = CastConnectingScreen;
