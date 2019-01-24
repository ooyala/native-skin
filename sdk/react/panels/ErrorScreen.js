import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {
  SAS_ERROR_CODES,
  ERROR_MESSAGE, BUTTON_NAMES,
} from '../constants';

var Log = require('../log');
var Utils = require('../utils');
var styles = Utils.getStyles(require('./style/errorScreenStyles.json'));
var stylesAudio = Utils.getStyles(require('./style/errorScreenStylesAudio.json'));

class ErrorScreen extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    isAudioOnly: PropTypes.bool,
    onPress: PropTypes.func
  };

  getTitle = () => {
    var errorCode = -1;
    if (this.props.error && this.props.error.code) {
      errorCode = this.props.error.code;
    }
    var title = Utils.stringForErrorCode(errorCode);
    var localizedTitle =
      Utils.localizedString(this.props.locale, title, this.props.localizableStrings).toUpperCase();
    return (
      <Text style={!this.props.isAudioOnly ? styles.title : stylesAudio.title}>
        {localizedTitle}
      </Text>);
  };

  getDescription = () => {
    if (this.props.error && this.props.error.description) {
      var userInfo = this.props.error.userInfo || {};
      var errorCode = SAS_ERROR_CODES[userInfo['code']] || '';
      var description = ERROR_MESSAGE[errorCode] || this.props.error.description;

      var localizedDescription =
        Utils.localizedString(this.props.locale, description, this.props.localizableStrings);
      Log.warn("ERROR: localized description:" + localizedDescription);
      return (
        <Text style={!this.props.isAudioOnly ? styles.description : stylesAudio.description}>
          {localizedDescription}
        </Text>);
    }
    return null;
  };

  render() {
    var title = this.getTitle();
    var description = this.getDescription();
    return (
      <View style={!this.props.isAudioOnly ? styles.container : stylesAudio.container}>
        <View style={!this.props.isAudioOnly ? styles.wrapper: stylesAudio.wrapper}>
          {title}
          {description}
          {this._renderMoreDetailsButton()}
        </View>
      </View>
    );
  }

  onMoreDetails = () => {
    this.props.onPress(BUTTON_NAMES.MORE_DETAILS);
  };

  _renderMoreDetailsButton = () => {
    if (!this.props.isAudioOnly) return null;

    const moreDetailsText = Utils.localizedString(this.props.locale, "More Details", this.props.localizableStrings);
    return (
      <TouchableHighlight
        onPress={this.onMoreDetails}>
        <View style={stylesAudio.button}>
          <Text style={stylesAudio.buttonText}>{moreDetailsText}</Text>
        </View>
      </TouchableHighlight>
    )
  };
}

module.exports = ErrorScreen;
