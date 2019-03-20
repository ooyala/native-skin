// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bottomOverlayFlexibleSpace: {
    flex: 1,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'column',
  },
  cuePoint: {
    backgroundColor: 'white',
    borderRadius: 900,
    position: 'absolute',
  },
  progressBarContainer: {
    height: 3,
    marginHorizontal: 20,
  },
  progressBarStyle: {
    height: 20,
    justifyContent: 'center',
  },
});
