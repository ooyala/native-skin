'use strict';

var {View, requireNativeComponent, PropTypes } = require('react-native');

var iface = {
  name: 'ClosedCaptionsView',
  propTypes: {
    ...View.propTypes,    
    caption: PropTypes.object
  },
};

module.exports = requireNativeComponent('RCTClosedCaptionsView', iface);

