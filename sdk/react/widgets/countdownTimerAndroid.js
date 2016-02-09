'use strict';

var {View, requireNativeComponent, PropTypes, Animated } = require('react-native');
var iface = {
  name: 'CountdownView',
  propTypes: {
    ...View.propTypes,
    countdown: PropTypes.object,
    data: PropTypes.object,
  }
};

module.exports = requireNativeComponent('RCTCountdownView', iface);