import React, { Component } from 'react';
import {
  AppRegistry,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  AccessibilityInfo,
  NativeModules
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

//calling class layout controller
const {
  OoyalaReactBridge
} = NativeModules;

import {
  CONTENT_TYPES,
  SCREEN_TYPES,
  DESIRED_STATES
} from './constants';
import OoyalaSkinCore from './ooyalaSkinCore';
let OoyalaSkinCoreInstance;

class OoyalaSkin extends Component {
  // note/todo: some of these are more like props, expected to be over-ridden/updated
  // by the native bridge, and others are used purely on the non-native side.
  // consider using a leading underscore, or something?
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
    onPlayComplete: false
  };

  componentWillMount() {
    OoyalaSkinCoreInstance = new OoyalaSkinCore(this, OoyalaReactBridge);
    OoyalaSkinCoreInstance.mount(RCTDeviceEventEmitter);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return OoyalaSkinCoreInstance.onBackPressed();
    });

    AccessibilityInfo.addEventListener(
      'change',
      this._handleScreenReaderToggled
    );
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({
        screenReaderEnabled: isEnabled
      });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    OoyalaSkinCoreInstance.unmount();

    AccessibilityInfo.removeEventListener(
      'change',
      this._handleScreenReaderToggled
    );
  }

  _handleScreenReaderToggled = (isEnabled) => {
    this.setState({
      screenReaderEnabled: isEnabled
    });
  };

  renderLoadingScreen = () => {
     return (
       <ActivityIndicator
        style={styles.loading}
        size='large'
      />
    );
  };

  renderVideoView = () => {
    return (
      <View style={styles.container}>
          <Text>{this.state.playerState}</Text>
      </View>
    );
  };

  render() {
    return OoyalaSkinCoreInstance.renderScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
