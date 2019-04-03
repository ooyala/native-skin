// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

const collapsedWidth = MARKERS_SIZES.TEXT_COLLAPSED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;
const expandedWidth = MARKERS_SIZES.TEXT_EXPANDED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH;

export default StyleSheet.create({
  expanded: {
    transform: [
      { translateX: expandedWidth / -2 },
    ],
    width: expandedWidth,
  },
  root: {
    ...commonMarkerStyle,
    transform: [
      { translateX: collapsedWidth / -2 },
    ],
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
