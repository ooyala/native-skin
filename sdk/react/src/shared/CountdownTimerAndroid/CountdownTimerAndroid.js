// @flow

import PropTypes from 'prop-types';
import { requireNativeComponent, ViewPropTypes } from 'react-native';

// TODO: Find a way to replace PropTypes.
const iface = {
  name: 'CountdownView',
  propTypes: {
    ...ViewPropTypes,
    countdown: PropTypes.shape({}),
    data: PropTypes.shape({}),
  },
};

export default requireNativeComponent('RCTCountdownView', iface);
