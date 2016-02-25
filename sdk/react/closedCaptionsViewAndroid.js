'use strict';

var {View, requireNativeComponent, PropTypes, Platform} = require('react-native');

if (Platform.OS === 'android') {
  var iface = {
    name: 'ClosedCaptionsView',
    propTypes: {
      ...View.propTypes,    
      caption: PropTypes.object
    },
  };

  module.exports = requireNativeComponent('RCTClosedCaptionsView', iface);
}
