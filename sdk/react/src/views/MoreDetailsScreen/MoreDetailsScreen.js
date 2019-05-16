// @flow

import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated, ScrollView, Text, View,
} from 'react-native';

import { BUTTON_NAMES, ERROR_MESSAGE, SAS_ERROR_CODES } from '../../constants';
import * as Log from '../../lib/log';
import * as Utils from '../../lib/utils';
import RectangularButton from '../../shared/RectangularButton';

import styles from './MoreDetailsScreen.styles';

const dismissButtonSize = 20;

export default class MoreDetailsScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func,
    config: PropTypes.object,
    error: PropTypes.object,
    localizableStrings: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      translateY: new Animated.Value(props.height),
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { opacity, translateY } = this.state;

    Animated.parallel([
      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0,
        },
      ),
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0,
        },
      ),
    ])
      .start();
  }

  onDismissBtnPress = () => {
    const { onDismiss } = this.props;

    onDismiss();
  };

  onDismissPress = () => {
    const { opacity } = this.state;

    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0,
      },
    )
      .start(this.onDismissBtnPress);
  };

  renderErrorTitle = () => {
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

  renderErrorDescription = () => {
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

  render() {
    const { config, height, width } = this.props;
    const { opacity } = this.state;

    const animationStyle = { opacity };

    return (
      <Animated.View style={[styles.fullscreenContainer,
        animationStyle,
        {
          height,
          width,
        }]}
      >

        <Animated.View style={[animationStyle,
          {
            height,
            width,
          }]}
        >
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
}
