'use strict';

import React, { Component } from 'react';
import {
  View, 
  requireNativeComponent, 
} from 'react-native';
  
var iface = {
  name: 'VolumeView',
  propTypes: {
    volume: React.PropTypes.object,
  }
};

// React automatically resolves this class from "OOVolumeViewManager"
module.exports = requireNativeComponent('OOVolumeView', null);