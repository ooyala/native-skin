import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet
} from 'react-native';

import { 
  VIEW_NAMES
} from '../constants';
import Log from '../log';
import Utils from '../utils';

import progressBarStyles from './style/progressBarStyles.json';
const styles = Utils.getStyles(progressBarStyles);

class ProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
    config: PropTypes.object,
    ad: PropTypes.object,
    renderDuration: PropTypes.bool
  };

  getAdScrubberBarPlayedColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else {
      if (this.props.config.controlBar.adScrubberBar.playedColor) {
        return this.props.config.controlBar.adScrubberBar.playedColor;
      } else {
        Log.error('controlBar.adScrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json');
        return '#FF3F80';
      }
    }
  };

  getScrubberBarPlayedColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    } else {
      if (this.props.config.controlBar.scrubberBar.playedColor) {
        return this.props.config.controlBar.scrubberBar.playedColor;
      } else {
        Log.error('controlBar.scrubberBar.playedColor and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json');
        return '#4389FF';
      }
    }
  };

  render() {
    const playedPercent = this.props.percent;
    const bufferedPercent = 0;
    const unbufferedPercent = 1 - playedPercent - bufferedPercent;

    let playedColor, backgroundColor, bufferedColor;

    if (this.props.ad) {
      playedColor = this.getAdScrubberBarPlayedColor();
      backgroundColor = this.props.config.controlBar.adScrubberBar.backgroundColor;
      bufferedColor = this.props.config.controlBar.adScrubberBar.bufferedColor;
    } else {
      playedColor = this.getScrubberBarPlayedColor();
      backgroundColor = this.props.config.controlBar.scrubberBar.backgroundColor;
      bufferedColor = this.props.config.controlBar.scrubberBar.bufferedColor;
    }

    const playedStyle = {backgroundColor: playedColor, flex: playedPercent};
    const backgroundStyle = {backgroundColor: backgroundColor, flex: bufferedPercent};
    const bufferedStyle = {backgroundColor: bufferedColor, flex: unbufferedPercent};
    const progressStyles = StyleSheet.create({ 
      played: playedStyle,
      background: backgroundStyle,
      buffered: bufferedStyle
    });

    return (
      <View
        style={styles.container}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        importantForAccessibility='no-hide-descendants'
        accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR}>
          <View
            style={progressStyles.played}
            testID={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}
            accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}>
          </View>
          <View
            style={progressStyles.background}
            testId={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}
            accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}>
          </View>
          <View
            style={progressStyles.buffered}
            testID={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}
            accessibilityLabel={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}>
          </View>
      </View>
    );
  }
}

module.exports = ProgressBar;
