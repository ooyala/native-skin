'use strict';

let Constants = require('./constants');

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation
} from 'react-native';

let Utils = require('./utils');
let styles = Utils.getStyles(require('./style/progressBarStyles.json'));
let {
  VIEW_NAMES
} = Constants;

class ProgressBar extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    config: PropTypes.object,
    ad: PropTypes.object
  };

  getAdScrubberBarPlayedColor = () => {
    if (!this.props.config.general.accentColor) {
      if (!this.props.config.controlBar.adScrubberBar.playedColor) {
        Log.error("controlBar.adScrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json");
        return '#FF3F80';
      } else {
       return this.props.config.controlBar.adScrubberBar.playedColor;
      }
    } else {
      return this.props.config.general.accentColor;
    }
  };

  getScrubberBarPlayedColor = () => {
    if (!this.props.config.general.accentColor) {
      if (!this.props.config.controlBar.scrubberBar.playedColor) {
        Log.error("controlBar.scrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json");
        return '#4389FF';
      } else {
        return this.props.config.controlBar.scrubberBar.playedColor;
      }
    } else {
       return this.props.config.general.accentColor;
    }
  };

  render() {
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
      <View
        style={styles.container}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR}
      >
        <View
          style={progressStyles.played}
          testID={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}
          accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}/>

        <View
          style={progressStyles.background}
          testId={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}
          accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}/>

        <View
          style={progressStyles.buffered}
          testID={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}
          accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}/>

      </View>
    );
  }
}

module.exports = ProgressBar;
