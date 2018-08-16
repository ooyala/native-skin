import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
var Log = require('../log');

class RectButton extends React.Component {
  static propTypes = {
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
    style:Text.propTypes.style,
  };

  // Gets the play button based on the current config settings
  render() {
    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.fontFamily};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};
    var positionStyle;
    if(this.props.style != null) {
      positionStyle = this.props.style;
    } else if (this.props.position == "center") {
      var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight) * 0.5);
      var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth) * 0.5);

      positionStyle =
      {position: 'absolute', top: topOffset, left: leftOffset};
    } else {
      positionStyle = styles[this.props.position];
    }
    return (
      <TouchableHighlight
        accessible={true}
        accessibilityLabel={this.props.name}
        accessibilityComponentType="button"
        style={positionStyle}
        onPress={this.props.onPress}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View>
          <Text style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle]}>{this.props.icon}</Text>
        </View>
      </TouchableHighlight>);
  }
}

module.exports = RectButton;