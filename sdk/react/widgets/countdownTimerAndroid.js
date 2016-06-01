'use strict';
import React, { Component } from 'react';
import {
  View, 
  requireNativeComponent, 
  Animated, 
  Platform 
} from 'react-native';

if (Platform.OS === 'android') {
  var iface = {
    name: 'CountdownView',
    propTypes: {
      ...View.propTypes,
      countdown: React.PropTypes.object,
      data: React.PropTypes.object,
    }
  };

  module.exports = requireNativeComponent('RCTCountdownView', iface);
}