// @flow

import React from 'react';
import { Animated, TouchableHighlight } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { STRING_CONSTANTS } from '../../constants';
import * as Accessibility from '../../lib/accessibility';

import styles from './SkipButton.styles';

type Props = {
  visible: boolean,
  disabled: boolean,
  isForward: boolean,
  timeValue: number,
  onSeek: boolean => void,
  icon: string,
  fontStyle?: TextStyleProp,
  sizeStyle?: ViewStyleProp,
  opacity?: TextStyleProp,
  animate?: TextStyleProp,
  buttonColor?: TextStyleProp,
};

export default class SkipButton extends React.Component<Props> {
  static defaultProps = {
    fontStyle: undefined,
    sizeStyle: undefined,
    opacity: undefined,
    animate: undefined,
    buttonColor: undefined,
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
