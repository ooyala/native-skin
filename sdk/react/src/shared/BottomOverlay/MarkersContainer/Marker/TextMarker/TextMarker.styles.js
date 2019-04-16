// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle, { restrainLeftPositionWithinContainer } from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

const collapsedWidth = MARKERS_SIZES.TEXT_COLLAPSED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;
const expandedWidth = MARKERS_SIZES.TEXT_EXPANDED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;

export default (leftPosition: number, containerWidth: number) => StyleSheet.create({
  expanded: {
    left: restrainLeftPositionWithinContainer(expandedWidth, leftPosition, containerWidth),
    width: expandedWidth,
  },
  root: {
    ...commonMarkerStyle,
    left: restrainLeftPositionWithinContainer(collapsedWidth, leftPosition, containerWidth),
    width: collapsedWidth,
  },
  text: {
    color: 'white',
    fontSize: MARKERS_SIZES.FONT_SIZE,
    lineHeight: MARKERS_SIZES.FONT_SIZE,
    textAlign: 'center',
  },
  triangle: triangleStyle,
});
