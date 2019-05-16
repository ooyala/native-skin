// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import styles from './RectangularButton.styles';

const RectangularButton = ({
  buttonColor, buttonHeight, buttonStyle, buttonWidth, fontFamily, fontSize, frameHeight, frameWidth, icon, name,
  onPress, opacity, position, style,
}) => {
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

RectangularButton.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  position: PropTypes.string,
  onPress: PropTypes.func,
  opacity: PropTypes.number,
  frameWidth: PropTypes.number,
  frameHeight: PropTypes.number,
  buttonWidth: PropTypes.number,
  buttonHeight: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonStyle: PropTypes.object,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  style: Text.propTypes.style,
};

export default RectangularButton;
