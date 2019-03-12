import PropTypes from 'prop-types';
import React from 'react';
import {Animated, TouchableHighlight} from 'react-native';

import {STRING_CONSTANTS} from '../constants';

const AccessibilityUtils = require('../accessibilityUtils');
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
const Log = require('../log');

class SwitchButton extends React.Component {

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

        </Animated.View>

      </TouchableHighlight>
    );
  };

  onPress = () => {
    this.props.onSwitch(this.props.isForward);
  };
}

module.exports = SwitchButton;
