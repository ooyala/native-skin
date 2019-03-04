'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View, 
  requireNativeComponent, 
} from 'react-native';

const iface = {
  name: 'PipButton',
  propTypes: {
    volume: PropTypes.object
  }
};

// React automatically resolves this class from "OOPiPViewManager"
module.exports = requireNativeComponent('PipButton', null); 
