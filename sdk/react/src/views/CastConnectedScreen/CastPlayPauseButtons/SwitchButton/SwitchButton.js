import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, TouchableHighlight } from 'react-native';

import { STRING_CONSTANTS } from '../../../../constants';
import AccessibilityUtils from '../../../../lib/accessibility';

import styles from '../../../../shared/styles/rectangularButton.styles';

export default class SwitchButton extends Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    isForward: PropTypes.bool.isRequired,
    onSwitch: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    fontStyle: PropTypes.object,
    sizeStyle: PropTypes.object,
    opacity: PropTypes.object,
    animate: PropTypes.object,
    buttonColor: PropTypes.object,
  };

  onPress = () => {
    const { props } = this;
    const { onSwitch, isForward } = props;
    onSwitch(isForward);
  };

  render() {
    const { props } = this;
    const {
      visible, isForward, timeValue, sizeStyle, disabled, icon, fontStyle, buttonColor, animate, opacity,
    } = props;
    if (!visible) {
      return null;
    }
    const accessibilityLabel = AccessibilityUtils
      .createAccessibilityForForwardButton(isForward, timeValue, STRING_CONSTANTS.SECONDS);
    const position = {
      position: 'absolute',
    };

    return (
      <TouchableHighlight
        accessible
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={() => this.onPress()}
        underlayColor="transparent"
        importantForAccessibility="yes"
        style={[sizeStyle]}
      >

        <Animated.View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Animated.Text
            accessible={false}
            style={[position, styles.buttonTextStyle, fontStyle, buttonColor, animate, opacity]}
          >
            {icon}
          </Animated.Text>
        </Animated.View>
      </TouchableHighlight>
    );
  }
}
