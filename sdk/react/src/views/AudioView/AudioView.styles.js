// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  controlBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBarIcon: {
    color: '#8E8E8E',
  },
  controlBarIconTouchable: {
    padding: 8,
  },
  controlBarVolumeSlider: {
    alignSelf: 'center',
    height: 30,
    width: 100,
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarScrubberContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  flexibleSpace: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerBaseLabel: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  titleLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-Bold',
  },
  subtitleLabel: {
    flex: 1,
    color: '#B3B3B3',
    fontFamily: 'AvenirNext-DemiBold',
  },
  progressBarTimeLabel: {
    fontSize: 12,
    marginHorizontal: 8,
    color: '#B3B3B3',
    fontFamily: 'AvenirNext-DemiBold',
  },
  progressBarNoTimeLabel: {
    fontSize: 12,
    marginHorizontal: 10,
    color: '#B3B3B3',
    fontFamily: 'AvenirNext-DemiBold',
  },
  liveLabel: {
    fontSize: 11,
    marginLeft: 4,
    marginRight: 8,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-Bold',
  },
  liveCircleActive: {
    marginLeft: 6,
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#FF0000',
  },
  liveCircleNonActive: {
    marginLeft: 6,
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#B3B3B3',
  },
});
