/**
 * The OoyalaSkinCore handles all of the methods that perform actions based on UI actions
 */
 "use strict";

import React, { Component } from "react";
import {
  ActivityIndicator,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

var Log = require("./log");
var Constants = require("./constants");
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OVERLAY_TYPES,
  OOSTATES,
  PLATFORMS,
  AUTOHIDE_DELAY,
  MAX_DATE_VALUE,
} = Constants;
var OoyalaSkinBridgeListener = require("./ooyalaSkinBridgeListener");
var OoyalaSkinPanelRenderer = require("./ooyalaSkinPanelRenderer");

var clickRadius = 5;
var startedClickX, startedClickY;

var OoyalaSkinCore = function(ooyalaSkin, eventBridge) {
  this.skin = ooyalaSkin;
  this.bridge = eventBridge;
  this.ooyalaSkinBridgeListener = new OoyalaSkinBridgeListener(ooyalaSkin, this, eventBridge);
  this.ooyalaSkinPanelRenderer = new OoyalaSkinPanelRenderer(ooyalaSkin, this, eventBridge);
};

OoyalaSkinCore.prototype.mount = function(eventEmitter) {
  this.ooyalaSkinBridgeListener.mount(eventEmitter);
  this.bridge.onMounted();
};

OoyalaSkinCore.prototype.unmount = function() {
  this.ooyalaSkinBridgeListener.unmount();
};

OoyalaSkinCore.prototype.emitDiscoveryOptionChosen = function(info) {
  this.bridge.onDiscoveryRow(info);
};

OoyalaSkinCore.prototype.dismissOverlay = function() {
  Log.log("On Overlay Dismissed");
  this.popFromOverlayStackAndMaybeResume();
}

OoyalaSkinCore.prototype.onBackPressed = function() {
    var retVal = this.popFromOverlayStackAndMaybeResume();
    return retVal;
};

OoyalaSkinCore.prototype.handleLanguageSelection = function(e) {
  Log.log("onLanguageSelected:" + e);
  this.skin.setState({selectedLanguage:e});
  this.bridge.onLanguageSelected({language:e});
};

OoyalaSkinCore.prototype.handleAudioTrackSelection = function(e) {
  Log.log("onAudioTrackSelected:" + e);
  this.skin.setState({selectedAudioTrack:e});
  this.bridge.onAudioTrackSelected({audioTrack:e});
};

// event handlers.
OoyalaSkinCore.prototype.handleMoreOptionsButtonPress = function(buttonName) {
  switch (buttonName) {
    case BUTTON_NAMES.DISCOVERY:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
      break;
    case BUTTON_NAMES.SHARE:
      this.ooyalaSkinPanelRenderer.renderSocialOptions();
      break;
    case BUTTON_NAMES.QUALITY:
      break;
    case BUTTON_NAMES.SETTING:
      break;
    default:
      break;
  }
};

/**
 *  When a button is pressed on the control bar
 *  If it's a "fast-access" options button, open options menu and perform the options action
 */
OoyalaSkinCore.prototype.handlePress = function(n) {
  switch(n) {
    case BUTTON_NAMES.MORE:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.MOREOPTION_SCREEN);
      break;
    case BUTTON_NAMES.DISCOVERY:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
      break;
    case BUTTON_NAMES.AUDIO_AND_CC:
      this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.AUDIO_AND_CC_SCREEN);
      break;
    case BUTTON_NAMES.SHARE:
      this.ooyalaSkinPanelRenderer.renderSocialOptions();
      break;
    case BUTTON_NAMES.QUALITY:
    case BUTTON_NAMES.SETTING:
      break;
    default:
      this.bridge.onPress({name:n});
      break;
  }
};

OoyalaSkinCore.prototype.handleScrub = function(value) {
  this.bridge.onScrub({percentage:value});
};

OoyalaSkinCore.prototype.handleIconPress = function(index) {
  this.bridge.onPress({name:BUTTON_NAMES.AD_ICON, index:index})
};

OoyalaSkinCore.prototype.handleAdOverlayPress = function(clickUrl) {
  this.bridge.onPress({name:BUTTON_NAMES.AD_OVERLAY, clickUrl:clickUrl})
};

OoyalaSkinCore.prototype.handleAdOverlayDismiss = function() {
  this.skin.setState({adOverlay: null})
};

OoyalaSkinCore.prototype.shouldShowLandscape = function() {
  return this.skin.state.width > this.skin.state.height;
};

OoyalaSkinCore.prototype.shouldShowDiscoveryEndscreen = function() {
  var endScreenConfig = this.skin.props.endScreen || {};
  var upNextConfig = this.skin.props.upNext || {};

  // Only care if discovery on endScreen should be shown
  if (endScreenConfig.screenToShowOnEnd !== "discovery") {
    return false;
  }

  // player didn't show upNext so show discovery
  // first we ask if showUpNext is part of the config, if not
  // we can assume showUpNext didn't show
  if (!upNextConfig.showUpNext || upNextConfig.showUpNext === false) {
    return true;
  }

  // player showed and closed the upNext widget
  if (this.skin.state.upNextDismissed) {
    return true;
  }

  // any other case
  return false;
};

/*
 * This could either reset the lastPressedTime, or zero it to force the hide
 */

OoyalaSkinCore.prototype.showControls = function() {
  let isPastAutoHideTime = (new Date).getTime() - this.skin.state.lastPressedTime > AUTOHIDE_DELAY;
  if (isPastAutoHideTime) {
    this.handleControlsTouch();
  } else {
    Log.verbose("handleVideoTouch - Time Zeroed");
    this.skin.setState({lastPressedTime: new Date(0)})
  }
};

OoyalaSkinCore.prototype.handleVideoTouchStart = function (event) {
  if (this.skin.state.vrContent){
    startedClickX = event.nativeEvent.pageX;
    startedClickY = event.nativeEvent.pageY;

    this.bridge.handleTouchStart({
      "x_location": event.nativeEvent.pageX,
      "y_location": event.nativeEvent.pageY,
      "touchTime" : event.nativeEvent.timestamp,
      "isClicked" : false
    });
  }
};

OoyalaSkinCore.prototype.handleVideoTouchMove = function (event) {
  if (this.skin.state.vrContent) {
    this.bridge.handleTouchMove({
      "x_location": event.nativeEvent.pageX,
      "y_location": event.nativeEvent.pageY,
      "touchTime" : event.nativeEvent.timestamp,
      "isClicked" : false
    });
  }
};

OoyalaSkinCore.prototype.handleVideoTouchEnd = function(event) {
  if (this.skin.state.vrContent && event) {
    let isClicked = isClick(event.nativeEvent.pageX, event.nativeEvent.pageY);
    if (isClicked) {
      this.showControls();
    }
    this.bridge.handleTouchEnd({
      "x_location" : event.nativeEvent.pageX,
      "y_location" : event.nativeEvent.pageY,
      "touchTime"  : event.nativeEvent.timestamp,
      "isClicked"  : isClicked
    });
  } else {
    this.showControls();
  }
};

/*
 * Hard reset lastPressedTime, either due to button press or otherwise
 */
OoyalaSkinCore.prototype.handleControlsTouch = function() {
  if (!this.skin.state.screenReaderEnabled && this.skin.props.controlBar.autoHide === true) {
    Log.verbose("handleVideoTouch - Time set");
    this.skin.setState({lastPressedTime: new Date()});
  } else {
    Log.verbose("handleVideoTouch infinite time");
    this.skin.setState({lastPressedTime: new Date(MAX_DATE_VALUE)});
  }
};

OoyalaSkinCore.prototype.pushToOverlayStackAndMaybePause = function(overlay) {
  if (this.skin.state.overlayStack.length === 0 && this.skin.state.playing) {
    Log.log("New stack of overlays, pausing")
    this.skin.setState({pausedByOverlay:true});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
  var retVal = this.skin.state.overlayStack.push(overlay);
  this.skin.forceUpdate();
  return retVal;
};

OoyalaSkinCore.prototype.clearOverlayStack = function(overlay) {
  this.skin.setState({overlayStack: []});
};

OoyalaSkinCore.prototype.popFromOverlayStackAndMaybeResume = function(overlay) {
  var retVal = this.skin.state.overlayStack.pop();

  if (this.skin.state.overlayStack.length === 0 && this.skin.state.pausedByOverlay) {
    Log.log("Emptied stack of overlays, resuming");
    this.skin.setState({pausedByOverlay:false});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
  this.skin.forceUpdate();
  return retVal;
};

OoyalaSkinCore.prototype.renderScreen = function() {
  Log.verbose("Rendering - Current Overlay stack: " + this.skin.state.overlayStack);
  let overlayType = null;
  if(this.skin.state.overlayStack.length > 0) {
    overlayType = this.skin.state.overlayStack[this.skin.state.overlayStack.length - 1];
    Log.verbose("Rendering Overlaytype: " + overlayType);
  } else {
    Log.verbose("Rendering screentype: " + this.skin.state.screenType);
  }

  return this.ooyalaSkinPanelRenderer.renderScreen(overlayType, this.skin.state.inAdPod, this.skin.state.screenType);
};

//return boolean -> touch end was in clickRadius from touch start
let isClick = function(endX, endY) {
  return Math.sqrt((endX - startedClickX) * (endX - startedClickX) + (endY - startedClickY) * (endY - startedClickY)) < clickRadius;
};
module.exports = OoyalaSkinCore;
