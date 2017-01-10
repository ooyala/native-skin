/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation
} from 'react-native';

var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/progressBarStyles.json'));

var ProgressBar = React.createClass({
  propTypes: {
    percent: React.PropTypes.number,
    config: React.PropTypes.object,
    ad: React.PropTypes.object
  },

  getAdScrubberBarPlayedColor: function() {
    if (!this.props.config.controlBar.adScrubberBar.playedColor) {
      if (!this.props.config.general.accentColor) {
        Log.error("controlBar.adScrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json");
        return '#FF3F80';
      } else {
       return this.props.config.general.accentColor;
      }
    }
  },

  getScrubberBarPlayedColor: function() {
    if (!this.props.config.controlBar.scrubberBar.playedColor) {
      if (!this.props.config.general.accentColor) {
        Log.error("controlBar.scrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add this to your skin.json");
        return '#FF3F80';
      } else {
        return this.props.config.general.accentColor;
      }
    }
  },

  render: function() {
    var playedPercent = this.props.percent;
    var bufferedPercent = 0;
    var unbufferedPercent = 1 - playedPercent - bufferedPercent;

    if (this.props.ad) {
      var playedColor = this.getAdScrubberBarPlayedColor();
      var backgroundColor = this.props.config.controlBar.adScrubberBar.backgroundColor;
      var bufferedColor = this.props.config.controlBar.adScrubberBar.bufferedColor;
    } else {
      var playedColor = this.getScrubberBarPlayedColor();
      var backgroundColor = this.props.config.controlBar.scrubberBar.backgroundColor;
      var bufferedColor = this.props.config.controlBar.scrubberBar.bufferedColor;
    }

    var playedStyle = {backgroundColor: playedColor, flex: playedPercent};
    var backgroundStyle = {backgroundColor: backgroundColor, flex: bufferedPercent};
    var bufferedStyle = {backgroundColor: bufferedColor, flex: unbufferedPercent};
    
    var progressStyles = StyleSheet.create({played:playedStyle, background:backgroundStyle, buffered:bufferedStyle});
    return (
      <View style={styles.container}>
        <View style={progressStyles.played} />
        <View style={progressStyles.background} />
        <View style={progressStyles.buffered} />
      </View>
    );
  }
});

module.exports = ProgressBar;
