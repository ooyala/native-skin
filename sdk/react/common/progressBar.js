'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import Log from '../log';
import { VIEW_NAMES } from '../constants';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/progressBarStyles.json'));

class ProgressBar extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    config: PropTypes.object,
    ad: PropTypes.object,
    renderDuration: PropTypes.bool
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
    const playedPercent = this.props.percent;
    const bufferedPercent = 0;
    const unbufferedPercent = 1 - playedPercent - bufferedPercent;

    if (this.props.ad) {
      var playedColor = this.getAdScrubberBarPlayedColor();
      var backgroundColor = this.props.config.controlBar.adScrubberBar.backgroundColor;
      var bufferedColor = this.props.config.controlBar.adScrubberBar.bufferedColor;
    } else {
      var playedColor = this.getScrubberBarPlayedColor();
      var backgroundColor = this.props.config.controlBar.scrubberBar.backgroundColor;
      var bufferedColor = this.props.config.controlBar.scrubberBar.bufferedColor;
    }

    const playedStyle = {backgroundColor: playedColor, flex: playedPercent};
    const backgroundStyle = {backgroundColor: backgroundColor, flex: bufferedPercent};
    const bufferedStyle = {backgroundColor: bufferedColor, flex: unbufferedPercent};
    const progressStyles = StyleSheet.create({played:playedStyle, background:backgroundStyle, buffered:bufferedStyle});

    return (
      <View
        style={styles.container}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        importantForAccessibility="no-hide-descendants"
        accessibilityLabel="">
          <View
            style={progressStyles.played}
            testID={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}
            accessibilityLabel=""/>
          <View
            style={progressStyles.background}
            testId={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}
            accessibilityLabel=""/>
          <View
            style={progressStyles.buffered}
            testID={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}
            accessibilityLabel=""/>
      </View>
    );
  }
}

module.exports = ProgressBar;
