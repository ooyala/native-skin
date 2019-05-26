// @flow
// Rule disabled because this component state used from Core.
/* eslint-disable react/no-unused-state */

import React from 'react';
import {
  AccessibilityInfo, ActivityIndicator, AppRegistry, NativeEventEmitter, NativeModules, StyleSheet,
} from 'react-native';

import { CONTENT_TYPES, DESIRED_STATES, SCREEN_TYPES } from './src/constants';
import Core from './src/Core';

const { OOReactSkinEventsEmitter, OOReactSkinBridgeModuleMain } = NativeModules;
const eventBridgeEmitter = new NativeEventEmitter(OOReactSkinEventsEmitter);

let OoyalaSkinCoreInstance;

const styles = StyleSheet.create({
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
    OoyalaSkinCoreInstance = new Core(this, OOReactSkinBridgeModuleMain);
    OoyalaSkinCoreInstance.mount(eventBridgeEmitter);
  }

  componentDidMount() {
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

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
