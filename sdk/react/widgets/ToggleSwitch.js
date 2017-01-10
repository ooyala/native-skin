/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

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
var ToggleSwitch = React.createClass({
  propTypes: {
    switchOn: React.PropTypes.bool,
    areClosedCaptionsAvailable: React.PropTypes.bool,
    switchOnText: React.PropTypes.string,
    switchOffText: React.PropTypes.string,
    onValueChanged: React.PropTypes.func,
    config: React.PropTypes.object,
    onTintColor: React.PropTypes.string,
    tintColor: React.PropTypes.string,
    thumbTintColor: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      onTintColor: '#498DFC',
      tintColor: '#DDDDDD',
    };
  },

  onSwitchToggled: function() {
    this.props.onValueChanged(!this.props.switchOn);
  },

  getThumbTintColor: function() {
    return this.props.config.general.accentColor ? this.props.config.general.accentColor : '#FFFFFF';
  },

  render: function() {
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
              onTintColor={this.props.onTintColor}
              tintColor={this.props.tintColor}
              thumbTintColor={this.getThumbTintColor()}/>
          <Text style={onTextStyle}>{this.props.switchOnText}</Text>
        </View>
    );
  },
});

module.exports = ToggleSwitch;