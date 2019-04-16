// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import { calculateLeftPositions, createRootStyle, createTriangleStyle } from '../styles/commonMarker.style';

const collapsedWidth = MARKERS_SIZES.TEXT_COLLAPSED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;
const expandedWidth = MARKERS_SIZES.TEXT_EXPANDED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;

export default (leftPosition: number, containerWidth: number) => {
  const { rootLeft, triangleLeft } = calculateLeftPositions(collapsedWidth, leftPosition, containerWidth);
  const { rootLeft: rootLeftExpanded, triangleLeft: triangleLeftExpanded } = calculateLeftPositions(expandedWidth,
    leftPosition, containerWidth);

  return StyleSheet.create({
    expanded: {
      left: rootLeftExpanded,
      width: expandedWidth,
    },
    root: {
      ...createRootStyle(),
      left: rootLeft,
      width: collapsedWidth,
    },
    text: {
      color: 'white',
      fontSize: MARKERS_SIZES.FONT_SIZE,
      lineHeight: MARKERS_SIZES.FONT_SIZE,
      textAlign: 'center',
    },
    triangle: {
      ...createTriangleStyle(),
      left: triangleLeft,
    },
    triangleExpanded: {
      left: triangleLeftExpanded,
    },
  });
};
