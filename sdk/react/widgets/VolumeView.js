'use strict';

var {View, requireNativeComponent, PropTypes, React } = require('react-native');
  var iface = {
    name: 'VolumeView',
    propTypes: {
      ...View.propTypes,
      volume: PropTypes.object,
    }
  };

// React automatically resolves this class from "OOVolumeViewManager"
module.exports = requireNativeComponent('OOVolumeView', null);

