/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';

var Log = require('./log');
var Utils = {

  renderRectButton: function(name, style, icon, func, size, color, fontFamily, key) {
    var RectButton = require('./widgets/RectButton');
    return (
      <RectButton
        name={name}
        key={key}
        icon={icon}
        onPress={func}
        fontSize={size}
        fontFamily={fontFamily}
        style={style}
        buttonColor={color}>
      </RectButton>
    );
  },

  shouldShowLandscape: function(width, height) {
    if (isNaN(width) || isNaN(height) ||
        width === null || height === null ||
        width < 0 || height < 0) {
      return false;
    }

    return width > height;
  },

  // Returns a React stylesheet based on the json object passed in. This method takes the json object,
  // adds in any global styles that are specifed in styles.json, and returns the React Stylesheet.
  getStyles: function(specificStyles) {
    var globalStyles = require('./style/styles.json');

    if(specificStyles == undefined) {
      specificStyles = {};
    }

    var styles = {};
    for (var attrname in globalStyles) { styles[attrname] = globalStyles[attrname]; }
    for (var attrname in specificStyles) { styles[attrname] = specificStyles[attrname]; }

    return StyleSheet.create(styles);
  },

  getTimerLabel: function(timer) {
    var timerLabel = "";

    if (timer < 10) {
      timerLabel = "00:0" + (timer | 0).toString();
    } else if (timer < 60) {
      timerLabel = "00:" + (timer | 0).toString();
    } else if (timer < 600){
      timerLabel = "0" + (timer / 60).toString() + ":" + (timer % 60).toString();
    } else {
      timerLabel = (timer / 60).toString() + ":" + (timer % 60).toString();
    }

    return timerLabel;
  },

  isPlaying: function( rate ) {
    return rate > 0;
  },

  isPaused: function( rate ) {
    return rate == 0;
  },

  secondsToString: function(seconds) {
    var  minus = '';
    if (seconds < 0) {
      minus = "-";
      seconds = -seconds;
    }
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    if (mm == 0) {
      mm = "00";
    } else if (mm < 10) {
      mm = "0" + mm;
    }
    var t = mm + ":" + ss;
    if (hh > 0) {
      t = hh + ":" + t;
    }
    return minus + t;
  },

  localizedString: function(preferredLocale, stringId, localizableStrings) {
    if (typeof stringId !== 'string') return null;
    if (typeof preferredLocale !== 'string') preferredLocale = undefined;
    if (typeof localizableStrings !== 'object' || localizableStrings === null) localizableStrings = {};

    Log.verbose("preferredLocale: " + preferredLocale + ", stringId: " + stringId + ", localizableStrings:");
    var defaultLocale = localizableStrings['defaultLanguage'] ? localizableStrings['defaultLanguage'] : 'en';

    if (preferredLocale && localizableStrings[preferredLocale] && localizableStrings[preferredLocale][stringId]) {
      return localizableStrings[preferredLocale][stringId];
    }

    if (localizableStrings[defaultLocale] && localizableStrings[defaultLocale][stringId]) {
      return localizableStrings[defaultLocale][stringId];
    }

    return stringId;
  },

  /**
   * Takes an integer error code andd locale
   * Returns the localized error message
  */
  stringForErrorCode: function(errorCode: int) {
    switch (errorCode) {
      /* Authorization failed - TODO add to language files */
      case 0: 
        return "Authorization failed";
      /* Authorization response invalid - TODO add to language files */
      case 1:
        return "Invalid Authorization Response";
       /* Authorization heartbeat failed */  
      case 2:
        return "INVALID HEARTBEAT"
       /* Content tree response invalid - TODO add to language files */  
      case 3:
        return "Content Tree Response Invalid";
       /* Authorization signature invalid - TODO add to language files */  
      case 4 :
        return "The signature of the Authorization Response is invalid";
      /* Content tree next failed - TODO add to language files */    
      case 5:
        return "Content Tree Next failed";
      /* Playback failed */    
      case 6:
        return "PLAYBACK ERROR";
      /* The asset is not encoded */    
      case 7:
        return "This video isn't encoded for your device";
      /* Internal error - TODO add to language files */    
      case 8:
        return "An internal error occurred";
      /* Metadata response invalid */    
      case 9:
        return "Invalid Metadata";
      /* Invalid authorization token */    
      case 10:
        return "INVALID PLAYER TOKEN";
      /* Device limit has been reached */    
      case 11:
        return "Device limit has been reached";
      /* Devuce binding failed */    
      case 12:
        return "Device binding failed";
       /* Device id too long */   
      case 13:
        return "Device ID is too long";
      /* General DRM failure */    
      case 14:
        return "General error acquiring license";
      /* DRM file download failure - TODO add to language files */    
      case 15:
        return "Failed to download a required file during the DRM workflow";
      /* DRM personalization failure - TODO add to language files */    
      case 16:
        return "Failed to complete device personalization during the DRM workflow";
      /*  DRM rights server error - TODO add to language files */    
      case 17:
        return "Failed to get rights for asset during the DRM workflow";
      /* Invalid discovery parameter - TODO add to language files */    
      case 18:
        return "The expected discovery parameters are not provided";
      /* Discovery network error - TODO add to language files */    
      case 19:
        return "A discovery network error occurred";
      /* Discovery response failure - TODO add to language files */    
      case 20:
        return "A discovery response error occurred";
      /* No available streams - TODO add to language files */    
      case 21:
        return "No available streams";
      /* Pcode mismatch - TODO add to language files */    
      case 22:
        return "The provided PCode does not match the embed code owner";
      /* Download error - TODO add to language files */   
      case 23:
        return "A download error occurred";
      /* Conncurrent streams */    
      case 24:
        return "You have exceeded the maximum number of concurrent streams";
      /*  Advertising id failure - TODO add to language files */    
      case 25:
        return "Failed to return the advertising ID";
      /* Discovery GET failure - TODO add to language files */    
      case 26:
        return "Failed to get discovery results";
      /* Discovery POST failure - TODO add to language files */
      case 27:
        return "Failed to post discovery pins";
      /* Unknown error - TODO add to language files */ 
      case 28:
        return "An unknown error occurred";
      /* Default to Unknown error */    
      default:
        return "An unknown error occurred";
    }
  },
};

module.exports = Utils;
