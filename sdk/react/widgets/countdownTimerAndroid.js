import PropTypes from 'prop-types';
import {
  View, 
  requireNativeComponent, 
  Platform 
} from 'react-native';

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