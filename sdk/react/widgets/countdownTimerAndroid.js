'use strict';

var {View, requireNativeComponent, PropTypes, Animated } = require('react-native');
var iface = {
  name: 'CountdownView',
  propTypes: {
    ...View.propTypes,
    countdown: PropTypes.object,
    embedCode: PropTypes.string,
  }
};

module.exports = requireNativeComponent('RCTCountdownView', iface);