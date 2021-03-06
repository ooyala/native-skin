// @flow

import React from 'react';
import { Animated, TouchableHighlight } from 'react-native';

import { STRING_CONSTANTS } from '../../../../constants';
import * as Accessibility from '../../../../lib/accessibility';

import styles from './SwitchButton.styles';

type Props = {
  visible: boolean,
  disabled: boolean,
  isForward: boolean,
  onSwitch: boolean => void,
  icon: string,
  fontStyle: {},
  sizeStyle: {},
  opacity: {},
  animate: {},
  buttonColor: {},
};

export default class SwitchButton extends React.Component<Props> {
  onPress = () => {
    const { onSwitch, isForward } = this.props;

    onSwitch(isForward);
  };

  render() {
    const {
      visible, isForward, sizeStyle, disabled, icon, fontStyle, buttonColor, animate, opacity,
    } = this.props;

    if (!visible) {
      return null;
    }

    const accessibilityLabel = Accessibility
      .createAccessibilityForForwardButton(isForward, undefined, STRING_CONSTANTS.SECONDS);
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
