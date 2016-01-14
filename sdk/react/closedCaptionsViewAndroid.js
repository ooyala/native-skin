'use strict';

var { requireNativeComponent, PropTypes } = require('react-native');

var iface = {
  name: 'ClosedCaptionsView',
  propTypes: {
    caption: PropTypes.object,
    videoWidth: PropTypes.number,
  },
};

module.exports = requireNativeComponent('RCTClosedCaptionsView', iface);

