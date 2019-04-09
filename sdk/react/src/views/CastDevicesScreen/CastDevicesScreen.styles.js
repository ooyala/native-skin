// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullscreenContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  listViewContainer: {
    marginTop: 50,
    marginBottom: 25,
    flex: 0,
  },
  dismissButtonTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconDismiss: {
    padding: 25,
  },
  title: {
    position: 'absolute',
    padding: 25,
    fontSize: 20,
    top: 0,
    left: 0,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
  },
});
