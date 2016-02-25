'use strict';
var {View, requireNativeComponent, PropTypes, Animated, Platform } = require('react-native');

if (Platform.OS === 'android') {
  var iface = {
    name: 'CountdownView',
    propTypes: {
      ...View.propTypes,
      countdown: PropTypes.object,
      data: PropTypes.object,
    }
  };

  module.exports = requireNativeComponent('RCTCountdownView', iface);
}