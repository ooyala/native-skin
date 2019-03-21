// @flow

import { StyleSheet } from 'react-native';

import { MARKERS_SIZES } from '../../../constants';
import commonMarkerStyle from '../styles/commonMarkerStyle';

export default StyleSheet.create({
  expanded: {
    height: MARKERS_SIZES.ICON_EXPANDED_SIZE,
    width: MARKERS_SIZES.ICON_EXPANDED_SIZE,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  root: {
    ...commonMarkerStyle,
    height: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
    width: MARKERS_SIZES.ICON_COLLAPSED_SIZE,
  },
});
