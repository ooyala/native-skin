// @flow

import { MARKERS_SIZES } from '../../../constants';

export default {
  borderColor: 'transparent',
  borderLeftWidth: MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  borderRightWidth: MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  borderTopWidth: 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  borderTopColor: '#4E4E4E',
  bottom: -2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  height: 0,
  left: '50%',
  position: 'absolute',
  transform: [
    { translateX: -0.5 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM },
  ],
  width: 0,
};
