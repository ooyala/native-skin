'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  Switch,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var Constants = require('../constants');

var styles = require('../utils').getStyles(require('./style/ToggleSwitchStyles.json'));

// Tint props only work for iOS.
class ToggleSwitch extends React.Component {
  static propTypes = {
    switchOn: PropTypes.bool,
    areClosedCaptionsAvailable: PropTypes.bool,
    switchOnText: PropTypes.string,
    switchOffText: PropTypes.string,
    onValueChanged: PropTypes.func,
    config: PropTypes.object,
    onTintColor: PropTypes.string,
    tintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
  };

  static defaultProps = {
    tintColor: '#DDDDDD',
    thumbTintColor: '#FFFFFF'
  };

  onSwitchToggled = () => {
    this.props.onValueChanged(!this.props.switchOn);
  };

  getOnTintColor = () => {
    return this.props.config.general.accentColor ? this.props.config.general.accentColor : '#498DFC';
  };

  render() {
    var onTextStyle = this.props.switchOn ? styles.highlightedText : styles.grayedText;
    var offTextStyle = this.props.switchOn ? styles.grayedText : styles.highlightedText;
    return (
        <View style={styles.container}>
          <Text style={offTextStyle}>{this.props.switchOffText}</Text>
            <Switch
              style={{"width":50}}
              value={this.props.switchOn}
              onValueChange={this.onSwitchToggled}
              disabled={!this.props.areClosedCaptionsAvailable}
              onTintColor={this.getOnTintColor()}
              tintColor={this.props.tintColor}
              thumbTintColor={this.props.thumbTintColor}/>
          <Text style={onTextStyle}>{this.props.switchOnText}</Text>
        </View>
    );
  }
}

module.exports = ToggleSwitch;