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

  renderRectButton: function(style, icon, func, size, color, fontFamily, key) {
    var RectButton = require('./widgets/RectButton');
    return (
      <RectButton
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
      /* Authorization failed */
      case 0: 
        return "AUTHORIZATION_FAILED";
      /* Authorization response invalid */
      case 1:
        return "Invalid Authorization Response";
       /* Authorization heartbeat failed */  
      case 2:
        return "INVALID HEARTBEAT"
       /* Content tree response invalid */  
      case 3:
        return "CONTENT_TREE_RESPONSE_FAILED";
       /* Authorization signature invalid */  
      case 4 :
        return "AUTHORIZATION_SIGNATURE_RESPONSE_FAILED";
      /* Content tree Nnext failed */    
      case 5:
        return "CONTENT_TREE_NEXT_FAILED";
      /* Playback failed */    
      case 6:
        return "PLAYBACK ERROR";
      /* The asset is not encoded */    
      case 7:
        return "This video isn't encoded for your device";
      /* Internal error */    
      case 8:
        return "INTERNAL_ERROR";
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
      /* DRM file download failure */    
      case 15:
        return "DRM_DOWNLOAD_FAILED";
      /* DRM personalization failure */    
      case 16:
        return "DRM_DEVICE_PERSONALIZATION_FAILED";
      /*  DRM righrs server error */    
      case 17:
        return "DRM_ASSET_RIGHTS_FAILED";
      /* Invalid discovery parameter */    
      case 18:
        return "DISCOVERY_PARAMETERS_NOT_PROVIDED";
      /* Discoveyr network error */    
      case 19:
        return "NETWORK ERROR";
      /* Discovery response failure */    
      case 20:
        return "DRM server error";
      /* No available streams */    
      case 21:
        return "NO_AVAILABLE_STREAMS";
      /* Pcode mismatch */    
      case 22:
        return "PCODE_DOES_NOT_MATCH_EMBED_CODE";
      /* Download error */   
      case 23:
        return "DOWNLOAD_ERROR";
      /* Conncurrent streams */    
      case 24:
        return "You have exceeded the maximum number of concurrent streams";
      /*  Advertising id failure */    
      case 25:
        return "FAILED_TO_RETURN_ADVERTISING_ID";
      /* Discovery GET failure */    
      case 26:
        return "DISCOVERY_RESULT_FAILURE";
      /* Discovery POST failure */
      case 27:
        return "DISCOVERY_PINS_FAILURE";
      /* Unknown error */ 
      case 28:
        return "UNKNOWN";
      /* Default to Unknown error */    
      default:
        return "UNKNOWN";
    }
  },
};

module.exports = Utils;
