// @flow
// Rule disabled because this component state used from Core.
/* eslint-disable react/no-unused-state */

import React from 'react';
import {
  AccessibilityInfo, ActivityIndicator, AppRegistry, BackHandler, NativeModules, StyleSheet, Text, View,
} from 'react-native';
// Not clear from where this module imported.
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'; // eslint-disable-line import/no-unresolved

import { CONTENT_TYPES, DESIRED_STATES, SCREEN_TYPES } from './src/constants';
import Core from './src/Core';

const { OoyalaReactBridge } = NativeModules;

let OoyalaSkinCoreInstance;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    height: 200,
    justifyContent: 'center',
  },
});

type Props = {};

type State = {};

class OoyalaSkin extends React.Component<Props, State> {
  // TODO: Some of these are more like props, expected to be over-ridden/updated by the native bridge, and others are
  // used purely on the non-native side. Consider using a leading underscore, or something?
  state = {
    // states from react
    screenType: SCREEN_TYPES.LOADING_SCREEN,
    overlayStack: [],
    // states from native
    title: '',
    description: '',
    cuePoints: [],
    promoUrl: '',
    hostedAtUrl: '',
    desiredState: DESIRED_STATES.DESIRED_PAUSE,
    playhead: 0,
    duration: 1,
    rate: 0,
    fullscreen: false,
    lastPressedTime: new Date(0),
    upNextDismissed: false,
    showPlayButton: true,
    isRootPipActivated: false,
    isRootPipButtonVisible: false,
    markers: [],
    // things which default to null and thus don't have to be stated:
    // selectedLanguage: null,
    // availableClosedCaptionsLanguages: null,
    // multiAudioEnabled: false,
    // selectedAudioTrack: null,
    // audioTracksTitles: null,
    // playbackSpeedEnabled: false,
    // playbackSpeedRates: null,
    // selectedPlaybackSpeedRate: null
    alertTitle: '',
    alertMessage: '',
    error: null,
    screenReaderEnabled: false,
    contentType: CONTENT_TYPES.VIDEO,
    onPlayComplete: false,
  };

  componentWillMount() {
    OoyalaSkinCoreInstance = new Core(this, OoyalaReactBridge);
    OoyalaSkinCoreInstance.mount(RCTDeviceEventEmitter);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => OoyalaSkinCoreInstance.onBackPressed());

    AccessibilityInfo.addEventListener(
      'change',
      this.handleScreenReaderToggled,
    );
    AccessibilityInfo.fetch()
      .done((isEnabled) => {
        this.setState({
          screenReaderEnabled: isEnabled,
        });
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    OoyalaSkinCoreInstance.unmount();

    AccessibilityInfo.removeEventListener(
      'change',
      this.handleScreenReaderToggled,
    );
  }

  handleScreenReaderToggled = (isEnabled) => {
    this.setState({
      screenReaderEnabled: isEnabled,
    });
  };

  renderLoadingScreen = () => (
    <ActivityIndicator
      style={styles.loading}
      size="large"
    />
  );

  renderVideoView = () => {
    const { playerState } = this.state;

    return (
      <View style={styles.container}>
        <Text>{playerState}</Text>
      </View>
    );
  };

  render() {
    return OoyalaSkinCoreInstance.renderScreen();
  }
}

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
