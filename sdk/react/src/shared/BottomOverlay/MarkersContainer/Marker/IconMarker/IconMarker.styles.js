// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import commonMarkerStyle, { restrainLeftPositionWithinContainer } from '../styles/commonMarker.style';
import triangleStyle from '../styles/triangle.style';

export default (leftPosition: number, containerWidth: number) => StyleSheet.create({
  expanded: {
    height: MARKERS_SIZES.ICON_EXPANDED_SIZE,
    left: restrainLeftPositionWithinContainer(MARKERS_SIZES.ICON_EXPANDED_SIZE, leftPosition, containerWidth),
    width: MARKERS_SIZES.ICON_EXPANDED_SIZE,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  root: {
    ...commonMarkerStyle,
    height: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
    left: restrainLeftPositionWithinContainer(MARKERS_SIZES.ICON_COLLAPSED_SIZE, leftPosition, containerWidth),
    width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
  },
  triangle: triangleStyle,
});
