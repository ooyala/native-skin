// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'flex-start',
  },
  infoPanelDescription: {
    textAlign: 'left',
    margin: 10,
  },
  infoPanelNW: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  infoPanelTitle: {
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 10,
  },
  infoPanelSW: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  promoImageSmall: {
    width: 180,
    height: 90,
    margin: 20,
  },
  waterMarkImage: {
    width: 160,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10,
  },
  waterMarkImageSE: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
