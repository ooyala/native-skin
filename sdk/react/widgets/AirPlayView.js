'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
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