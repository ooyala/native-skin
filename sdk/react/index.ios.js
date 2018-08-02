/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  DeviceEventEmitter,
  StyleSheet,
  AccessibilityInfo
} from 'react-native';

var Constants = require('./constants');
var {
  SCREEN_TYPES,
  PLATFORMS,
  DESIRED_STATES
} = Constants;
var OoyalaSkinCore = require('./ooyalaSkinCore');
var eventBridge = require('NativeModules').OOReactBridge;

var OoyalaSkinCoreInstance;

class OoyalaSkin extends React.Component {
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
    lastPressedTime: new Date(0),
    upNextDismissed: false,
    showPlayButton: true,
    // things which default to null and thus don't have to be stated:
    // selectedLanguage: null,
    // availableClosedCaptionsLanguages: null,
    // multiAudioEnabled: false,
    // selectedAudioTrack: null,
    // audioTracksTitles: null,
    alertTitle: '',
    alertMessage: '',
    error: null,
    volume: 0,          // between 0 and 1
    platform:PLATFORMS.IOS,
    screenReaderEnabled: false,
  };

  componentWillMount() {
    OoyalaSkinCoreInstance = new OoyalaSkinCore(this, eventBridge);
    OoyalaSkinCoreInstance.mount(DeviceEventEmitter);
  }

  componentDidMount() {
    AccessibilityInfo.addEventListener(
      'change',
      this._handleScreenReaderToggled
    );
    AccessibilityInfo.fetch().done((isEnabled) => {
      this.setState({
        screenReaderEnabled: isEnabled
      });
    });

    // TODO: Figure out how to add setAccessibilityFocus method from the ObjC side
    // AccessibilityInfo.setAccessibilityFocus(1);
  }

  componentWillUnmount() {
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
          animating={true}
          size="large"
      />);
  };

  render() {
    return OoyalaSkinCoreInstance.renderScreen();
  }
}

var styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
});
AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
