// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../constants';
import commonMarkerStyle from '../styles/commonMarkerStyle';

export default StyleSheet.create({
  expanded: {
    width: MARKERS_SIZES.TEXT_EXPANDED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH,
  },
  root: {
    ...commonMarkerStyle,
    color: 'white',
    fontSize: MARKERS_SIZES.FONT_SIZE,
    lineHeight: MARKERS_SIZES.FONT_SIZE,
    textAlign: 'center',
    width: MARKERS_SIZES.TEXT_COLLAPSED_WIDTH + 2 * MARKERS_SIZES.PADDING + 2 * MARKERS_SIZES.BORDER_WIDTH,
  },
});
