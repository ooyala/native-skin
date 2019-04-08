// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  panelErrorPanel: {
    alignSelf: 'flex-end',
  },
  panelErrorInfo: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: 'black',
    marginBottom: 10,
    marginRight: 10,
  },
  panelWarning: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    marginRight: 10,
    marginBottom: 10,
  },
  panelErrorTitleText: {
    flex: 1,
    fontSize: 10,
    padding: 7,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  panelErrorContentText: {
    flex: 1,
    fontSize: 9.8,
    padding: 7,
    color: 'white',
    textAlign: 'center',
  },
  rightContainer: {
    flex: 1,
    marginLeft: 8,
  },
  contentText: {
    marginTop: 8,
    textAlign: 'left',
  },
  thumbnailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPortrait: {
    width: 148,
    height: 88,
  },
  thumbnailLandscape: {
    width: 128,
    height: 88,
  },
  columnContainerPortrait: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 5,
    marginTop: 20,
  },
  columnContainerLandscape: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 4,
    marginTop: 20,
  },
  waterMarkImage: {
    width: 160,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10,
  },
  panelTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelTitleText: {
    padding: 10,
    margin: 10,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: 'white',
  },
  panelIcon: {
    textAlign: 'left',
    fontFamily: 'ooyala-slick-type',
    fontSize: 16,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerFlexibleSpace: {
    flex: 1,
  },
  dismissButton: {
    padding: 20,
  },
  dismissIcon: {
    flex: 1,
    fontFamily: 'ooyala-slick-type',
    fontSize: 20,
    color: 'white',
  },
  panel: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
