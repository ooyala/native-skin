import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { BUTTON_NAMES, ERROR_MESSAGE, SAS_ERROR_CODES } from '../../constants';
import * as Log from '../../lib/log';
import * as Utils from '../../lib/utils';

import styles from './ErrorScreen.styles';

export default class ErrorScreen extends Component {
  static propTypes = {
    error: PropTypes.object,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    isAudioOnly: PropTypes.bool,
    onPress: PropTypes.func,
  };

  getTitle = () => {
    const { error, locale, localizableStrings } = this.props;

    let errorCode = -1;
    if (error && error.code) {
      errorCode = error.code;
    }
    const title = Utils.stringForErrorCode(errorCode);
    const localizedTitle = Utils.localizedString(locale, title, localizableStrings).toUpperCase();

    return (
      <Text style={styles.title}>
        {localizedTitle}
      </Text>
    );
  };

  getTitleAudioOnly = () => {
    const { locale, localizableStrings } = this.props;

    const title = 'unplayable content error';
    const localizedTitle = Utils.localizedString(locale, title, localizableStrings).toUpperCase();

    return (
      <Text style={styles.titleAudio}>
        {localizedTitle}
      </Text>
    );
  };

  getDescription = () => {
    const { error, locale, localizableStrings } = this.props;

    if (error && error.description) {
      const userInfo = error.userInfo || {};
      const errorCode = SAS_ERROR_CODES[userInfo.code] || '';
      const description = ERROR_MESSAGE[errorCode] || error.description;

      const localizedDescription = Utils.localizedString(locale, description, localizableStrings);

      Log.warn(`ERROR: localized description:${localizedDescription}`);

      return (
        <Text style={styles.description}>
          {localizedDescription}
        </Text>
      );
    }
    return null;
  };

  getDescriptionAudioOnly = () => {
    const { locale, localizableStrings } = this.props;

    const description = 'Reload your screen or try selecting different audio.';
    const localizedDescription = Utils.localizedString(locale, description, localizableStrings);

    return (
      <Text style={styles.descriptionAudio}>
        {localizedDescription}
      </Text>
    );
  };

  onMoreDetails = () => {
    const { onPress } = this.props;

    onPress(BUTTON_NAMES.MORE_DETAILS);
  };

  renderMoreDetailsButton = () => {
    const { isAudioOnly, locale, localizableStrings } = this.props;

    if (!isAudioOnly) {
      return null;
    }

    const moreDetailsText = Utils.localizedString(locale, 'More Details', localizableStrings);

    return (
      <TouchableHighlight
        onPress={this.onMoreDetails}
        style={styles.buttonContainer}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>{moreDetailsText}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { isAudioOnly } = this.props;

    return (
      <View style={isAudioOnly ? styles.containerAudio : styles.container}>
        <View style={isAudioOnly ? styles.wrapperAudio : styles.wrapper}>
          {isAudioOnly ? this.getTitleAudioOnly() : this.getTitle()}
          {isAudioOnly ? this.getDescriptionAudioOnly() : this.getDescription()}
          {this.renderMoreDetailsButton()}
        </View>
      </View>
    );
  }
}
