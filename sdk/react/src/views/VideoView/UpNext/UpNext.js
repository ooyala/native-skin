// @flow

import React from 'react';
import {
  ImageBackground, Platform, Text, TouchableHighlight, View,
} from 'react-native';

import { BUTTON_NAMES } from '../../../constants';
import CountdownViewAndroid from '../../../shared/CountdownTimerAndroid';
import CountdownView from '../../../shared/CountdownTimerIos';
import type { Config } from '../../../types/Config';

import styles from './UpNext.styles';

const defaultCountdownVal = 10;

type Props = {
  config: Config,
  playhead: number,
  duration: number,
  ad: {},
  nextVideo: {},
  onPress: string => void,
  upNextDismissed: boolean,
};

export default class UpNext extends React.Component<Props> {
  dismissUpNext = () => {
    const { onPress } = this.props;

    onPress('upNextDismiss');
  };

  clickUpNext = () => {
    const { onPress } = this.props;

    onPress('upNextClick');
  };

  upNextDuration = () => {
    const { config, duration } = this.props;

    const upNextConfig = config.upNext || {};

    // TODO: Unit test this functionality, there're still some edge cases
    if (typeof upNextConfig.timeToShow === 'string') {
      // Support old version of percentage (e.g. '80%')
      if (upNextConfig.timeToShow.indexOf('%') >= 0) {
        return (duration - parseFloat(upNextConfig.timeToShow.slice(0, -1) / 100) * duration);
      }

      if (Number.isNaN(upNextConfig.timeToShow)) {
        // The string is not a valid number
        return defaultCountdownVal;
      }

      // if we are given a number of seconds from end in which to show the upnext dialog.
      return parseInt(upNextConfig.timeToShow, 10);
    }

    if (typeof upNextConfig.timeToShow === 'number') {
      if (upNextConfig.timeToShow > 0.0 && upNextConfig.timeToShow <= 1.0) {
        // New percentage mode (e.g. 0.8)
        return duration - upNextConfig.timeToShow * duration;
      }

      if (upNextConfig.timeToShow > 1.0) {
        // Normal number (e.g. 15)
        return upNextConfig.timeToShow;
      }

      // 0 or negative number
      return defaultCountdownVal;
    }

    // Not a valid string nor number, return default.
    return defaultCountdownVal;
  };

  isWithinShowUpNextBounds = () => {
    const { duration, playhead } = this.props;

    return parseInt(this.upNextDuration(), 10) > duration - playhead;
  };

  renderDismissButton = () => {
    const { config } = this.props;

    return (
      <TouchableHighlight
        accessible
        accessibilityLabel={BUTTON_NAMES.DISMISS}
        accessibilityComponentType="button"
        onPress={this.dismissUpNext}
        underlayColor="transparent"
        style={styles.dismissButtonContainer}
      >
        <Text style={[
          styles.dismissButton,
          { fontFamily: config.icons.dismiss.fontFamilyName },
        ]}
        >
          {config.icons.dismiss.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  renderCountdownTimer = () => {
    const { duration, playhead } = this.props;

    return Platform.select({
      ios: (
        <CountdownView
          style={styles.countdownView}
          automatic={false}
          time={this.upNextDuration()}
          timeLeft={duration - playhead}
          radius={9}
          fillAlpha={0.7}
        />
      ),
      android: (
        <CountdownViewAndroid
          style={styles.countdownView}
          countdown={{
            main_color: '#AAffffff',
            secondary_color: '#AA808080',
            fill_color: '#AA000000',
            text_color: '#AAffffff',
            stroke_width: 5,
            text_size: 25,
            max_time: this.upNextDuration(),
            progress: parseInt((this.upNextDuration() - (duration - playhead)), 10),
            automatic: false,
          }}
        />
      ),
    });
  };

  render() {
    const {
      ad, config, nextVideo, upNextDismissed,
    } = this.props;

    const upNextConfig = config.upNext || {};

    if (this.isWithinShowUpNextBounds() && !upNextDismissed && upNextConfig.showUpNext === true && !ad && nextVideo) {
      const countdown = this.renderCountdownTimer();

      const upNextImage = (
        <TouchableHighlight
          style={styles.thumbnail}
          accessible
          onPress={this.clickUpNext}
        >
          <ImageBackground
            style={styles.thumbnailImage}
            source={{ uri: nextVideo.imageUrl }}
            accessible={false}
          >
            <Text
              style={styles.thumbnailPlayButton}
              accessibilityLabel={BUTTON_NAMES.UP_NEXT}
            >
              {config.icons.play.fontString}
            </Text>
          </ImageBackground>
        </TouchableHighlight>
      );

      const upNextDescription = (
        <View style={styles.textContainer}>
          {countdown}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              Up next:
              {' '}
              {nextVideo.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {nextVideo.description}
            </Text>
          </View>
        </View>
      );

      const upNextDismissButton = this.renderDismissButton();

      return (
        <View style={styles.container}>
          {upNextImage}
          {upNextDescription}
          {upNextDismissButton}
        </View>
      );
    }

    return null;
  }
}
