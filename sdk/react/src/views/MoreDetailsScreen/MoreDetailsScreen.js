import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Animated, ScrollView, Text, View,
} from 'react-native';

import { BUTTON_NAMES, ERROR_MESSAGE, SAS_ERROR_CODES } from '../../constants';
import Log from '../../lib/log';
import * as Utils from '../../lib/utils';
import RectangularButton from '../../shared/RectangularButton';

import styles from './MoreDetailsScreen.styles';

const dismissButtonSize = 20;

export default class MoreDetailsScreen extends Component {
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
    button: ''
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
    const { config, height, width } = this.props;
    const { opacity } = this.state;

    const animationStyle = { opacity };

    return (
      <Animated.View style={[styles.fullscreenContainer, animationStyle, { height, width }]}>

        <Animated.View style={[animationStyle, { height, width }]}>
          <ScrollView
            style={[styles.column, styles.scrollContainer]}
            indicatorStyle="white"
          >
            {this.renderErrorTitle()}
            {this.renderErrorDescription()}
          </ScrollView>
        </Animated.View>

        <View style={styles.dismissButtonTopRight}>
          <RectangularButton
            name={BUTTON_NAMES.DISMISS}
            style={styles.iconDismiss}
            icon={config.icons.dismiss.fontString}
            onPress={this.onDismissPress}
            fontSize={dismissButtonSize}
            buttonColor={config.moreDetailsScreen.color}
            fontFamily={config.icons.dismiss.fontFamilyName}
          />
        </View>

      </Animated.View>
    );
  }

  renderErrorTitle = () => {
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

  renderErrorDescription = () => {
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
  }
}
