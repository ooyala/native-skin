import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';

import OoyalaSkinCore from './ooyalaSkinCore';
import {
  CONTENT_TYPES,
  SCREEN_TYPES,
  DESIRED_STATES,
} from './constants';

const {
  OOReactSkinEventsEmitter,
  OOReactSkinBridgeModuleMain,
} = NativeModules;
const eventBridgeEmitter = new NativeEventEmitter(OOReactSkinEventsEmitter);
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
    desiredState: DESIRED_STATES.DESIRED_PAUSE,
    promoUrl: '',
    hostedAtUrl: '',
    playhead: 0,
    duration: 1,
    cuePoints: [],
    rate: 0,
    fullscreen: false,
    isRootPipActivated: true,
    isRootPipButtonVisible: true,
    lastPressedTime: new Date(0),
    upNextDismissed: false,
    showPlayButton: true,
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
    volume: 0, // between 0 and 1
    screenReaderEnabled: false,
    contentType: CONTENT_TYPES.VIDEO,
    onPlayComplete: false,
  };

  componentWillMount() {
    OoyalaSkinCoreInstance = new OoyalaSkinCore(this, OOReactSkinBridgeModuleMain);
    OoyalaSkinCoreInstance.mount(eventBridgeEmitter);
  }

  componentDidMount() {
    AccessibilityInfo.addEventListener(
      'change',
      this.handleScreenReaderToggled,
    );
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({
        screenReaderEnabled: isEnabled,
      });
    });

    // TODO: Figure out how to add setAccessibilityFocus method from the ObjC side
    // AccessibilityInfo.setAccessibilityFocus(1);
  }

  componentWillUnmount() {
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
      animating
      size="large"
    />
  );

  render() {
    return OoyalaSkinCoreInstance.renderScreen();
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
