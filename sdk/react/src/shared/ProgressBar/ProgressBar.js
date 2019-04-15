import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';

import { VIEW_NAMES } from '../../constants';
import * as Log from '../../lib/log';

import styles from './ProgressBar.styles';

export default class ProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
    config: PropTypes.shape({
      general: PropTypes.shape({
        accentColor: PropTypes.string,
      }),
      controlBar: PropTypes.shape({
        adScrubberBar: PropTypes.shape({
          playedColor: PropTypes.string,
          backgroundColor: PropTypes.string,
          bufferedColor: PropTypes.string,
        }),
        scrubberBar: PropTypes.shape({
          playedColor: PropTypes.string,
          backgroundColor: PropTypes.string,
          bufferedColor: PropTypes.string,
        }),
      }),
    }),
    ad: PropTypes.bool,
  };

  static defaultProps = {
    percent: 0,
    config: {},
    ad: false,
  };

  getAdScrubberBarPlayedColor = () => {
    const { config } = this.props;
    const { general, controlBar } = config;
    const { accentColor } = general;
    const { adScrubberBar } = controlBar;
    const { playedColor } = adScrubberBar;

    if (accentColor) {
      return accentColor;
    }

    if (playedColor) {
      return playedColor;
    }

    Log.error('controlBar.adScrubberBar.playedColor and general.accentColor are not defined in your skin.json. '
      + ' Please update your skin.json file to the latest provided file, or add these to your skin.json');
    return '#FF3F80';
  };

  getScrubberBarPlayedColor = () => {
    const { config } = this.props;
    const { general, controlBar } = config;
    const { accentColor } = general;
    const { scrubberBar } = controlBar;
    const { playedColor } = scrubberBar;

    if (accentColor) {
      return accentColor;
    }

    if (playedColor) {
      return playedColor;
    }

    Log.error('controlBar.scrubberBar.playedColor and general.accentColor are not defined in your skin.json. '
      + 'Please update your skin.json file to the latest provided file, or add these to your skin.json');
    return '#4389FF';
  };

  render() {
    const { percent, ad, config } = this.props;
    const { controlBar } = config;

    const bufferedPercent = 0;
    const unbufferedPercent = 1 - percent - bufferedPercent;

    let playedColor;
    let bgColor;
    let buffColor;

    if (ad) {
      playedColor = this.getAdScrubberBarPlayedColor();
      const { adScrubberBar } = controlBar;
      const { backgroundColor, bufferedColor } = adScrubberBar;
      bgColor = backgroundColor;
      buffColor = bufferedColor;
    } else {
      playedColor = this.getScrubberBarPlayedColor();
      const { scrubberBar } = controlBar;
      const { backgroundColor, bufferedColor } = scrubberBar;
      bgColor = backgroundColor;
      buffColor = bufferedColor;
    }

    const playedStyle = {
      backgroundColor: playedColor,
      flex: percent,
    };
    const backgroundStyle = {
      backgroundColor: bgColor,
      flex: bufferedPercent,
    };
    const bufferedStyle = {
      backgroundColor: buffColor,
      flex: unbufferedPercent,
    };

    return (
      <View
        style={styles.container}
        testID={VIEW_NAMES.TIME_SEEK_BAR}
        importantForAccessibility="no-hide-descendants"
        accessibilityLabel=""
      >
        <View
          style={playedStyle}
          testID={VIEW_NAMES.TIME_SEEK_BAR_PLAYED}
          accessibilityLabel=""
        />
        <View
          style={backgroundStyle}
          testId={VIEW_NAMES.TIME_SEEK_BAR_BACKGROUND}
          accessibilityLabel=""
        />
        <View
          style={bufferedStyle}
          testID={VIEW_NAMES.TIME_SEEK_BAR_BUFFERED}
          accessibilityLabel=""
        />
      </View>
    );
  }
}
