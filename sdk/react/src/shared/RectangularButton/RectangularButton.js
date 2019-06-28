// @flow

import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import styles from './RectangularButton.styles';

type Props = {
  icon?: string,
  name?: string,
  position?: string,
  onPress?: () => void,
  opacity?: number,
  frameWidth?: number,
  frameHeight?: number,
  buttonWidth?: number,
  buttonHeight?: number,
  buttonColor?: string,
  buttonStyle?: TextStyleProp,
  fontSize?: number,
  fontFamily?: string,
  style?: ViewStyleProp,
};

const RectangularButton = ({
  buttonColor, buttonHeight, buttonStyle, buttonWidth, fontFamily, fontSize, frameHeight, frameWidth, icon, name,
  onPress, opacity, position, style,
}: Props) => {
  let positionStyle;

  if (style) {
    positionStyle = style;
  } else if (position === 'center') {
    const topOffset = Math.round((frameHeight - buttonHeight) * 0.5);
    const leftOffset = Math.round((frameWidth - buttonWidth) * 0.5);

    positionStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
    };
  } else {
    positionStyle = styles[position];
  }

  return (
    <TouchableHighlight
      accessible
      accessibilityLabel={name}
      accessibilityComponentType="button"
      style={positionStyle}
      onPress={onPress}
      underlayColor="transparent"
      activeOpacity={opacity}
    >
      <View>
        <Text
          style={[
            styles.buttonTextStyle,
            {
              color: buttonColor || 'white',
              fontSize,
              fontFamily,
            },
            buttonStyle,
          ]}
        >
          {icon}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

RectangularButton.defaultProps = {
  icon: undefined,
  name: undefined,
  position: undefined,
  onPress: undefined,
  opacity: undefined,
  frameWidth: undefined,
  frameHeight: undefined,
  buttonWidth: undefined,
  buttonHeight: undefined,
  buttonColor: undefined,
  buttonStyle: undefined,
  fontSize: undefined,
  fontFamily: undefined,
  style: undefined,
};

export default RectangularButton;
