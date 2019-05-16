// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { BUTTON_NAMES } from '../../../constants';
import * as Log from '../../../lib/log';
import * as Utils from '../../../lib/utils';

import styles from './AdBar.styles';

export default class AdBar extends React.Component {
  static propTypes = {
    ad: PropTypes.shape({}),
    playhead: PropTypes.number,
    duration: PropTypes.number,
    onPress: PropTypes.func,
    width: PropTypes.number,
    localizableStrings: PropTypes.shape({}),
    locale: PropTypes.string,
  };

  onLearnMore = () => {
    const { onPress } = this.props;

    onPress(BUTTON_NAMES.LEARNMORE);
  };

  onSkip = () => {
    const { onPress } = this.props;

    onPress(BUTTON_NAMES.SKIP);
  };

  generateResponsiveText = (showLearnMore, showSkip) => {
    const {
      ad, duration, locale, localizableStrings, playhead, width,
    } = this.props;

    let textString;
    const count = ad.count || 1;
    const unplayed = ad.unplayedCount || 0;

    const remainingString = Utils.secondsToString(duration - playhead);

    let prefixString = Utils.localizedString(locale, 'Ad Playing', localizableStrings);

    if (ad.title && ad.title.length > 0) {
      prefixString += ':';
    }

    const countString = `(${count - unplayed}/${count})`;

    let allowedTextLength = width - 32;
    if (showLearnMore) {
      allowedTextLength -= ad.measures.learnmore + 32;
    }

    Log.verbose(`width: ${width}. allowed: ${allowedTextLength}. learnmore: ${ad.measures.learnmore}`);
    Log.verbose(
      `. duration: ${ad.measures.duration}. count: ${ad.measures.count}. title: ${ad.measures.title}. prefix: ${ad.measures.prefix}`,
    );

    if (ad.skipoffset >= 0) {
      if (showSkip) {
        allowedTextLength -= ad.measures.skipad + 32;
      } else {
        allowedTextLength -= ad.measures.skipadintime + 32;
      }
    }

    if (ad.measures.duration <= allowedTextLength) {
      textString = remainingString;
      allowedTextLength -= ad.measures.duration;

      Log.verbose(`allowedAfterDuration: ${allowedTextLength}`);

      if (ad.measures.count <= allowedTextLength) {
        textString = countString + textString;
        allowedTextLength -= ad.measures.count;

        Log.verbose(`allowedAfterCount: ${allowedTextLength}`);

        if (ad.measures.title <= allowedTextLength) {
          textString = ad.title + textString;
          allowedTextLength -= ad.measures.title;

          Log.verbose(`allowedAfterTitle: ${allowedTextLength}`);

          if (ad.measures.prefix <= allowedTextLength) {
            textString = prefixString + textString;
          }
        }
      }
    }

    return textString;
  };

  render() {
    const {
      ad, locale, localizableStrings, playhead,
    } = this.props;

    let learnMoreButton;
    let skipButton;
    let skipLabel;
    const showLearnMore = ad.clickUrl && ad.clickUrl.length > 0;
    const showSkip = playhead >= ad.skipoffset;
    const textString = this.generateResponsiveText(showLearnMore, showSkip);
    const learnMoreText = Utils.localizedString(locale, 'Learn More', localizableStrings);

    const skipLabelText = Utils.localizedString(locale, 'Skip Ad in ', localizableStrings);
    const skipText = Utils.localizedString(locale, 'Skip Ad', localizableStrings);

    if (showLearnMore) {
      learnMoreButton = (
        <TouchableHighlight
          onPress={this.onLearnMore}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>{learnMoreText}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    if (ad.skipoffset >= 0) {
      if (showSkip) {
        skipButton = (
          <TouchableHighlight
            onPress={this.onSkip}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>{skipText}</Text>
            </View>
          </TouchableHighlight>
        );
      } else {
        skipLabel = (
          <Text allowFontScaling style={styles.label}>
            {skipLabelText + Utils.getTimerLabel(ad.skipoffset - playhead)}
          </Text>
        );
      }
    }

    return (
      <View style={styles.container}>
        <Text allowFontScaling style={styles.label}>{textString}</Text>
        <View style={styles.placeholder} />
        {learnMoreButton}
        {skipLabel}
        {skipButton}
      </View>
    );
  }
}
