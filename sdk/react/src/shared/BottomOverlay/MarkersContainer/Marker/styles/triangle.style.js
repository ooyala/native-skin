// @flow

import { MARKERS_SIZES } from '../../../../../constants';

export default {
  // Create triangle shape using border magic.
  borderColor: 'transparent',
  borderTopColor: '#4E4E4E',
  borderWidth: MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  borderBottomWidth: 0,
  bottom: -1 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  height: 0,
  position: 'absolute',
  width: 0,
};
