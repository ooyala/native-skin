// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

export default (leftPosition: number, containerWidth: number) => StyleSheet.create({
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
    left: leftPosition,
    transform: [
      { translateX: MARKERS_SIZES.ICON_COLLAPSED_SIZE / -2 },
    ],
    width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
  },
  triangle: triangleStyle,
});
