// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle, { restrainLeftPositionWithinContainer } from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

const collapsedWidth = MARKERS_SIZES.TEXT_COLLAPSED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;
const expandedWidth = MARKERS_SIZES.TEXT_EXPANDED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;

export default (leftPosition: number, containerWidth: number) => {
  let left = restrainLeftPositionWithinContainer(collapsedWidth, leftPosition, containerWidth);
  let triangleLeft = leftPosition - left - MARKERS_SIZES.DISTANCE_FROM_BOTTOM;

  let leftExpanded = restrainLeftPositionWithinContainer(expandedWidth, leftPosition, containerWidth);
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
  if (triangleLeft > collapsedWidth - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM) {
    left += (triangleLeft - (collapsedWidth - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM));
    triangleLeft = collapsedWidth - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM;
  }

  if (triangleLeftExpanded > expandedWidth - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM) {
    leftExpanded += (triangleLeftExpanded - (expandedWidth - MARKERS_SIZES.BORDER_RADIUS - 2
      * MARKERS_SIZES.DISTANCE_FROM_BOTTOM));
    triangleLeftExpanded = expandedWidth - MARKERS_SIZES.BORDER_RADIUS - 2 * MARKERS_SIZES.DISTANCE_FROM_BOTTOM;
  }

  return StyleSheet.create({
    expanded: {
      left: leftExpanded,
      width: expandedWidth,
    },
    root: {
      ...commonMarkerStyle,
      left,
      width: collapsedWidth,
    },
    text: {
      color: 'white',
      fontSize: MARKERS_SIZES.FONT_SIZE,
      lineHeight: MARKERS_SIZES.FONT_SIZE,
      textAlign: 'center',
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
