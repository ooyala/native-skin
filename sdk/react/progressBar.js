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

  render: function() {
    var playedPercent = this.props.percent;
    var bufferedPercent = 0;
    var unbufferedPercent = 1 - playedPercent - bufferedPercent;

    if (this.props.ad) {
      var playedColor = this.props.config.controlBar.adScrubberBar.playedColor;
      var backgroundColor = this.props.config.controlBar.adScrubberBar.backgroundColor;
      var bufferedColor = this.props.config.controlBar.adScrubberBar.bufferedColor;
    } else {
      var playedColor = this.props.config.controlBar.scrubberBar.playedColor;
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
