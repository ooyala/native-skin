import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';

const AccessibilityUtils = require('../accessibilityUtils');
const Constants = require('../constants');
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));

class FwdButton extends React.Component {

  static propTypes = {
    isForward: PropTypes.bool.isRequired,
    timeValue: PropTypes.number.isRequired,
    currentPosition: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    fontStyle: PropTypes.object,
    opacity: PropTypes.object,
    animate: PropTypes.object,
    buttonColor: PropTypes.object
  };

  state = {
    movedPosition: 0
  };

  componentWillReceiveProps(nextProps) {
    this.state.movedPosition = nextProps.currentPosition;
  }

  render() {
    const accessibilityLabel = AccessibilityUtils.createAccessibilityForForwardButton(this.props.isForward, this.props.timeValue, Constants.STRING_CONSTANTS.SECONDS);
    return (
      <TouchableHighlight
        accessible = {true}
        accessibilityLabel={accessibilityLabel}
        accessibilityComponentType="button"
        style={[styles.buttonTextContainer]}
        onPress={this.onPress}
        underlayColor="transparent">
        <Animated.Text
          accessible={false}
          sstyle={[styles.buttonTextStyle, this.props.fontStyle, this.props.buttonColor, this.props.animate, this.props.opacity]}>
          {this.props.icons[name].icon}
        </Animated.Text>
      </TouchableHighlight>
    );
  };

  onPress = () => {

  };
};