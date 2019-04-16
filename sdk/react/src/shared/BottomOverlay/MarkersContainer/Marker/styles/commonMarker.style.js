// @flow

import { MARKERS_SIZES } from '../../../../../constants';

export default {
  backgroundColor: 'black',
  borderColor: '#4E4E4E',
  borderRadius: 2,
  borderWidth: MARKERS_SIZES.BORDER_WIDTH,
  bottom: MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  padding: MARKERS_SIZES.PADDING,
  position: 'absolute',
  shadowColor: 'black',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};

export const restrainLeftPositionWithinContainer = (width: number, leftPosition: number, containerWidth: number) => {
  let left = leftPosition - width / 2;

  // Restrain left edge.
  if (left < 0) {
    left = 0;
  }

  // Restrain right edge.
  if (left + width > containerWidth) {
    left = containerWidth - width;
  }

  return left;
};
