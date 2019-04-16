// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../../../constants';
import { calculateLeftPositions, createRootStyle, createTriangleStyle } from '../styles/commonMarker.style';

export default (leftPosition: number, containerWidth: number) => {
  const { rootLeft, triangleLeft } = calculateLeftPositions(MARKERS_SIZES.ICON_COLLAPSED_SIZE, leftPosition,
    containerWidth);
  const { rootLeft: rootLeftExpanded, triangleLeft: triangleLeftExpanded } = calculateLeftPositions(
    MARKERS_SIZES.ICON_EXPANDED_SIZE, leftPosition, containerWidth,
  );

  return StyleSheet.create({
    expanded: {
      height: MARKERS_SIZES.ICON_EXPANDED_SIZE,
      left: rootLeftExpanded,
      width: MARKERS_SIZES.ICON_EXPANDED_SIZE,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    root: {
      ...createRootStyle(),
      height: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
      left: rootLeft,
      width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
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
