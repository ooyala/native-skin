'use strict';

var { requireNativeComponent, PropTypes } = require('react-native');

var iface = {
  name: 'ClosedCaptionsView',
  propTypes: {
    caption: PropTypes.object
  },
};

module.exports = requireNativeComponent('RCTClosedCaptionsView', iface);

