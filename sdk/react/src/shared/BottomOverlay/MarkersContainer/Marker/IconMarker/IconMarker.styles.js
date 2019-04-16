// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle, { restrainLeftPositionWithinContainer } from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

export default (leftPosition: number, containerWidth: number) => {
  let left = restrainLeftPositionWithinContainer(MARKERS_SIZES.ICON_COLLAPSED_SIZE, leftPosition, containerWidth);
  let triangleLeft = leftPosition - left - MARKERS_SIZES.DISTANCE_FROM_BOTTOM;

  let leftExpanded = restrainLeftPositionWithinContainer(MARKERS_SIZES.ICON_EXPANDED_SIZE, leftPosition,
    containerWidth);
  let triangleLeftExpanded = leftPosition - leftExpanded - MARKERS_SIZES.DISTANCE_FROM_BOTTOM;

  // Balance left positions of marker and triangle for the left edge case.
  if (triangleLeft < MARKERS_SIZES.BORDER_RADIUS) {
    left -= (MARKERS_SIZES.BORDER_RADIUS - triangleLeft);
    triangleLeft = MARKERS_SIZES.BORDER_RADIUS;
  }

  if (triangleLeftExpanded < MARKERS_SIZES.BORDER_RADIUS) {
    leftExpanded -= (MARKERS_SIZES.BORDER_RADIUS - triangleLeftExpanded);
    triangleLeftExpanded = MARKERS_SIZES.BORDER_RADIUS;
  }

  // Balance left positions of marker and triangle for the right edge case.
  if (triangleLeft > MARKERS_SIZES.ICON_COLLAPSED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
    * MARKERS_SIZES.DISTANCE_FROM_BOTTOM) {
    left += (triangleLeft - (MARKERS_SIZES.ICON_COLLAPSED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
      * MARKERS_SIZES.DISTANCE_FROM_BOTTOM));
    triangleLeft = MARKERS_SIZES.ICON_COLLAPSED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
      * MARKERS_SIZES.DISTANCE_FROM_BOTTOM;
  }

  if (triangleLeftExpanded > MARKERS_SIZES.ICON_EXPANDED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
    * MARKERS_SIZES.DISTANCE_FROM_BOTTOM) {
    leftExpanded += (triangleLeftExpanded - (MARKERS_SIZES.ICON_EXPANDED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
      * MARKERS_SIZES.DISTANCE_FROM_BOTTOM));
    triangleLeftExpanded = MARKERS_SIZES.ICON_EXPANDED_SIZE - MARKERS_SIZES.BORDER_RADIUS - 2
      * MARKERS_SIZES.DISTANCE_FROM_BOTTOM;
  }

  return StyleSheet.create({
    expanded: {
      height: MARKERS_SIZES.ICON_EXPANDED_SIZE,
      left: leftExpanded,
      width: MARKERS_SIZES.ICON_EXPANDED_SIZE,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    root: {
      ...commonMarkerStyle,
      height: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
      left,
      width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
    },
    triangle: {
      ...triangleStyle,
      left: triangleLeft,
    },
    triangleExpanded: {
      left: triangleLeftExpanded,
    },
  });
};
