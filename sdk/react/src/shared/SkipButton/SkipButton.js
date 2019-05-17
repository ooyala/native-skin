// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { Animated, TouchableHighlight } from 'react-native';

import { STRING_CONSTANTS } from '../../constants';
import * as Accessibility from '../../lib/accessibility';

import styles from './SkipButton.styles';

export default class SkipButton extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    isForward: PropTypes.bool.isRequired,
    timeValue: PropTypes.number.isRequired,
    onSeek: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    fontStyle: PropTypes.shape({}),
    sizeStyle: PropTypes.shape({}),
    opacity: PropTypes.shape({}),
    animate: PropTypes.shape({}),
    buttonColor: PropTypes.shape({}),
  };

  onPress = () => {
    const { isForward, onSeek } = this.props;

    onSeek(isForward);
  };

  render() {
    const {
      animate, buttonColor, disabled, fontStyle, icon, isForward, opacity, sizeStyle, timeValue, visible,
    } = this.props;

    if (!visible) {
      return null;
    }

    const accessibilityLabel = Accessibility.createAccessibilityForForwardButton(isForward, timeValue,
      STRING_CONSTANTS.SECONDS);

    return (
      <TouchableHighlight
        accessible
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={() => this.onPress()}
        underlayColor="transparent"
        importantForAccessibility="yes"
        style={sizeStyle}
      >
        <Animated.View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Animated.Text
            accessible={false}
            style={[
              { position: 'absolute' },
              styles.buttonTextStyle,
              fontStyle,
              buttonColor,
              animate,
              opacity,
            ]}
          >
            {icon}
          </Animated.Text>
          <Animated.Text
            accessible={false}
            style={[
              {
                fontSize: fontStyle.fontSize * 0.5,
                position: 'absolute',
              },
              buttonColor,
              opacity,
            ]}
          >
            {timeValue}
          </Animated.Text>
        </Animated.View>
      </TouchableHighlight>
    );
  }
}
