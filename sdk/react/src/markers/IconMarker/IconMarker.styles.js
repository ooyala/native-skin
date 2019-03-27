// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../constants';
import commonMarkerStyle from '../styles/commonMarkerStyle';
import triangleStyle from '../styles/triangleStyle';

export default StyleSheet.create({
  expanded: {
    height: MARKERS_SIZES.ICON_EXPANDED_SIZE,
    transform: [
      { translateX: MARKERS_SIZES.ICON_EXPANDED_SIZE / -2 },
    ],
    width: MARKERS_SIZES.ICON_EXPANDED_SIZE,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  root: {
    ...commonMarkerStyle,
    height: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
    transform: [
      { translateX: MARKERS_SIZES.ICON_COLLAPSED_SIZE / -2 },
    ],
    width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
  },
  triangle: triangleStyle,
});
