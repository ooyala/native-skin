// @flow

import { MARKERS_SIZES } from '../../../../../constants';

export const createRootStyle = () => ({
  backgroundColor: 'black',
  borderColor: '#4E4E4E',
  borderRadius: MARKERS_SIZES.BORDER_RADIUS,
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
});

export const createTriangleStyle = () => ({
  // Create triangle shape using border magic.
  borderColor: 'transparent',
  borderTopColor: '#4E4E4E',
  borderWidth: MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  borderBottomWidth: 0,
  bottom: -1 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM,
  height: 0,
  position: 'absolute',
  width: 0,
});

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

export const calculateLeftPositions = (width: number, leftPosition: number, containerWidth: number) => {
  let rootLeft = restrainLeftPositionWithinContainer(width, leftPosition, containerWidth);
  // Distance from the bottom here appears to be half of the triangle width.
  let triangleLeft = leftPosition - rootLeft - MARKERS_SIZES.DISTANCE_FROM_BOTTOM;

  // Border radius here is a "safe space" padding from the edge of marker.
  if (triangleLeft < MARKERS_SIZES.BORDER_RADIUS) {
    // Balance on the left edge.
    rootLeft -= (MARKERS_SIZES.BORDER_RADIUS - triangleLeft);
    triangleLeft = MARKERS_SIZES.BORDER_RADIUS;
  } else if (triangleLeft > width - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM) {
    // Balance on the right edge.
    rootLeft += (triangleLeft - (width - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM));
    triangleLeft = width - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM;
  }

  return {
    rootLeft,
    triangleLeft,
  };
};
