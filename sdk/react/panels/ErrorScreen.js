import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

var Log = require('../log');
var Utils = require('../utils');
var Constants = require('../constants');
var {
  SAS_ERROR_CODES,
  ERROR_MESSAGE,
} = Constants;
var styles = Utils.getStyles(require('./style/errorScreenStyles.json'));

class ErrorScreen extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string
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
      <Text style={styles.title}>
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
        <Text style={styles.description}>
          {localizedDescription}
        </Text>);
    }
    return null;
  };

  render() {
    var title = this.getTitle();
    var description = this.getDescription();
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {title}
          {description}
        </View>
      </View>
    );
  }
}

module.exports = ErrorScreen;
