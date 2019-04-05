import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Animated
} from 'react-native';

import {
  STRING_CONSTANTS
} from '../../constants';
import AccessibilityUtils from '../../lib/accessibility';
import Utils from '../../lib/utils';

import rectButtonStyles from '../styles/rectangularButton.styles';
const styles = Utils.getStyles(rectButtonStyles);

export default class SkipButton extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    isForward: PropTypes.bool.isRequired,
    timeValue: PropTypes.number.isRequired,
    onSeek: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    fontStyle: PropTypes.object,
    sizeStyle: PropTypes.object,
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
    if(!this.props.visible) {
      return null;
    }
    const accessibilityLabel = AccessibilityUtils.createAccessibilityForForwardButton(this.props.isForward, this.props.timeValue, STRING_CONSTANTS.SECONDS);
    const position = {
      position: 'absolute'
    };
    return (
      <TouchableHighlight
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        disabled={this.props.disabled}
        onPress={() => this.onPress()}
        underlayColor='transparent'
        importantForAccessibility={'yes'}
        style={[this.props.sizeStyle]}>
        <Animated.View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Text
            accessible={false}
            style={[position, styles.buttonTextStyle, this.props.fontStyle, this.props.buttonColor, this.props.animate, this.props.opacity]}>
            {this.props.icon}
          </Animated.Text>
          <Animated.Text
            accessible={false}
            style={[position, {fontSize: this.props.fontStyle.fontSize * 0.5}, this.props.buttonColor, this.props.opacity]}>
            {this.props.timeValue}
          </Animated.Text>
        </Animated.View>
      </TouchableHighlight>
    );
  };

  onPress = () => {
    this.props.onSeek(this.props.isForward);
  };
}