import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, 
  requireNativeComponent, 
} from 'react-native';

const iface = {
  name: 'AirPlayView',
  propTypes: {
    volume: PropTypes.object
  }
};

// React automatically resolves this class from "OOAirPlayViewManager"
module.exports = requireNativeComponent('OOAirPlayView', null);
