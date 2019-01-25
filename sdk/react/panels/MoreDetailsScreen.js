'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {Animated, ScrollView, Text, View,} from 'react-native';

import {BUTTON_NAMES, ERROR_MESSAGE, SAS_ERROR_CODES,} from '../constants';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/moreDetailsScreenStyles.json'));

import Log from '../log';

const dismissButtonSize = 20;

class MoreDetailsScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func,
    config: PropTypes.object,
    error: PropTypes.object
  };

  state = {
    translateY: new Animated.Value(this.props.height),
    opacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(1),
    button: '',
  };

  componentDidMount() {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  onDismissBtnPress = () => {
    this.props.onDismiss();
  };

  onDismissPress = () => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0
      }
    ).start(this.onDismissBtnPress);
  };

  render() {
    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
      styles.iconDismiss,
      this.props.config.icons.dismiss.fontString,
      this.onDismissPress, dismissButtonSize,
      this.props.config.moreDetailsScreen.color,
      this.props.config.icons.dismiss.fontFamilyName);
    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = {opacity: this.state.opacity};
    return (
      <Animated.View
        style={[styles.fullscreenContainer, animationStyle, {height: this.props.height, width: this.props.width}]}>
        <Animated.View
          style={[animationStyle, {height: this.props.height, width: this.props.width}]}>
          <ScrollView
            style={[styles.column, styles.scrollContainer]}
            indicatorStyle={"white"}>
            {this._renderErrorTitle()}
            {this._renderErrorDescription()}
          </ScrollView>
        </Animated.View>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  _renderErrorTitle = () => {
    var errorCode = -1;
    if (this.props.error && this.props.error.code) {
      errorCode = this.props.error.code;
    }
    const title = Utils.stringForErrorCode(errorCode);
    const localizedTitle =
      Utils.localizedString(this.props.locale, title, this.props.localizableStrings).toUpperCase();
    return (
      <Text style={styles.title}>
        {localizedTitle}
      </Text>);
  };

  _renderErrorDescription = () => {
    if (this.props.error && this.props.error.description) {
      const userInfo = this.props.error.userInfo || {};
      const errorCode = SAS_ERROR_CODES[userInfo['code']] || '';
      const description = ERROR_MESSAGE[errorCode] || this.props.error.description;

      const localizedDescription =
        Utils.localizedString(this.props.locale, description, this.props.localizableStrings);
      Log.warn("ERROR: localized description:" + localizedDescription);
      return (
        <Text style={styles.description}>
          {localizedDescription}
        </Text>);
    }
    return null;
  }
}

module.exports = MoreDetailsScreen;
