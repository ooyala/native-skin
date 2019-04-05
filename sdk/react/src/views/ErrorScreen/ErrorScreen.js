import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {
  SAS_ERROR_CODES,
  ERROR_MESSAGE,
  BUTTON_NAMES
} from '../../constants';
import Log from '../../lib/log';
import * as Utils from '../../lib/utils';

import errorScreenStyles from './ErrorScreen.styles';
import errorScreenStylesAudio from './ErrorScreenAudio.styles';

const styles = Utils.getStyles(errorScreenStyles);
const stylesAudio = Utils.getStyles(errorScreenStylesAudio);

export default class ErrorScreen extends Component {
  static propTypes = {
    error: PropTypes.object,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    isAudioOnly: PropTypes.bool,
    onPress: PropTypes.func
  };

  getTitle = () => {
    let errorCode = -1;
    if (this.props.error && this.props.error.code) {
      errorCode = this.props.error.code;
    }
    const title = Utils.stringForErrorCode(errorCode);
    const localizedTitle = Utils.localizedString(this.props.locale, title, this.props.localizableStrings).toUpperCase();
    return (
      <Text style={styles.title}>
        {localizedTitle}
      </Text>
    );
  };

  getTitleAudioOnly = () => {
    const title = 'unplayable content error';
    const localizedTitle = Utils.localizedString(this.props.locale, title, this.props.localizableStrings).toUpperCase();
    return (
      <Text style={stylesAudio.title}>
        {localizedTitle}
      </Text>
    );
  };

  getDescription = () => {
    if (this.props.error && this.props.error.description) {
      const userInfo = this.props.error.userInfo || {};
      const errorCode = SAS_ERROR_CODES[userInfo['code']] || '';
      const description = ERROR_MESSAGE[errorCode] || this.props.error.description;

      const localizedDescription = Utils.localizedString(this.props.locale, description, this.props.localizableStrings);
      Log.warn('ERROR: localized description:' + localizedDescription);
      return (
        <Text style={styles.description}>
          {localizedDescription}
        </Text>
      );
    }
    return null;
  };

  getDescriptionAudioOnly = () => {
    const description = 'Reload your screen or try selecting different audio.';
    const localizedDescription = Utils.localizedString(this.props.locale, description, this.props.localizableStrings);
    return (
      <Text style={stylesAudio.description}>
        {localizedDescription}
      </Text>
    );
  };

  render() {
    return (
      <View style={this.props.isAudioOnly ? stylesAudio.container : styles.container}>
        <View style={this.props.isAudioOnly ? stylesAudio.wrapper : styles.wrapper}>
          {this.props.isAudioOnly ? this.getTitleAudioOnly() : this.getTitle()}
          {this.props.isAudioOnly ? this.getDescriptionAudioOnly() : this.getDescription()}
          {this._renderMoreDetailsButton()}
        </View>
      </View>
    );
  }

  onMoreDetails = () => {
    this.props.onPress(BUTTON_NAMES.MORE_DETAILS);
  };

  _renderMoreDetailsButton = () => {
    if (!this.props.isAudioOnly) { return null };

    const moreDetailsText = Utils.localizedString(this.props.locale, 'More Details', this.props.localizableStrings);
    return (
      <TouchableHighlight
        onPress={this.onMoreDetails}
        style={stylesAudio.buttonContainer}>
        <View style={stylesAudio.button}>
          <Text style={stylesAudio.buttonText}>{moreDetailsText}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}
