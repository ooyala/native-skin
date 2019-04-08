// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  closedCaptionsContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedCaptions: {
    alignSelf: 'center',
    textAlign: 'center',
    padding: 4,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  dismissOverlay: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  dismissIcon: {
    flex: 1,
    fontFamily: 'ooyala-slick-type',
    fontSize: 20,
    color: 'white',
  },
});
