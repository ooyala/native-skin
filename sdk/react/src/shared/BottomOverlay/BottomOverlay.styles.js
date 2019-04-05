// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  bottomOverlayFlexibleSpace: {
    flex: 1,
  },
  container: {
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
