import PropTypes from 'prop-types';
import {
  View, 
  requireNativeComponent
} from 'react-native';

const iface = {
  name: 'CountdownView',
  propTypes: {
    ...View.propTypes,
    countdown: PropTypes.object,
    data: PropTypes.object,
  }
};

module.exports = requireNativeComponent('RCTCountdownView', iface);
