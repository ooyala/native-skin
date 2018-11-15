'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Text
} from 'react-native';
import PropTypes from 'prop-types';

import Log from './log';
import { VIEW_NAMES } from './constants';

const Utils = require('./utils');
const ResponsiveDesignManager = require('./responsiveDesignManager');
const styles = Utils.getStyles(require('./style/progressBarStyles.json'));

class ProgressBar extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    config: PropTypes.object,
    ad: PropTypes.object,
    renderDuration: PropTypes.bool,
    playHeadString: PropTypes.string,
    durationString: PropTypes.string
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

  _renderPlayHeadWidget = () => {
    const playHead = <Text style={styles.playHeadTimeStyle}>{this.props.playHeadString}</Text>;
    return (
      <View
        style={styles.completeTimeStyle}>
        {playHead}
      </View>
    );
  };

  _renderDurationWidget = () => {
    const duration = <Text style={styles.durationStyle}>{this.props.durationString}</Text>;
    return (
      <View
        style={styles.completeTimeStyle}>
        {duration}
      </View>
    );
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

    let playedStyle = {backgroundColor: playedColor, flex: playedPercent};
    let backgroundStyle = {backgroundColor: backgroundColor, flex: bufferedPercent};
    let bufferedStyle = {backgroundColor: bufferedColor, flex: unbufferedPercent};

    let progressStyles = StyleSheet.create({played:playedStyle, background:backgroundStyle, buffered:bufferedStyle});
    return (
      <View
        style={styles.container}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR}>
        {this._renderPlayHeadWidget()}

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
          {this._renderDurationWidget()}
      </View>
    );
  }
}

module.exports = ProgressBar;
