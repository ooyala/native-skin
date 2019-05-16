// @flow

import PropTypes from 'prop-types';
import { requireNativeComponent, ViewPropTypes } from 'react-native';

const iface = {
  name: 'CountdownView',
  propTypes: {
    ...ViewPropTypes,
    countdown: PropTypes.object,
    data: PropTypes.object,
  },
};

export default requireNativeComponent('RCTCountdownView', iface);
