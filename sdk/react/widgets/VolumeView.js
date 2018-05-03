'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View, 
  requireNativeComponent, 
} from 'react-native';

var iface = {
  name: 'VolumeView',
  propTypes: {
    volume: PropTypes.object,
  }
};

// React automatically resolves this class from "OOVolumeViewManager"
module.exports = requireNativeComponent('OOVolumeView', null);