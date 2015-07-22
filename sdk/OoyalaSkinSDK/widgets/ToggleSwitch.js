/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Constants = require('../constants');
var {
  ICONS,
} = Constants;

var styles = require('../utils').getStyles(require('./style/ToggleSwitchStyles.json'));

var ToggleSwitch = React.createClass({
  propTypes: {
    switchOn: React.PropTypes.bool,
    swithOnText: React.PropTypes.string,
    swithOffText: React.PropTypes.string,
    onValueChanged: React.PropTypes.func,
    config: React.PropTypes.object
  },

  onSwitchToggled: function() {
    this.props.onValueChanged(!this.props.switchOn);
  },

  render: function() {
    console.log("renderToggleSwith"+this.props.switchOn);
    var onTextStyle = this.props.switchOn ? styles.highlightedText : styles.grayedText;
    var offTextStyle = this.props.switchOn ? styles.grayedText : styles.highlightedText;
    var switchIcon = this.props.switchOn ? this.props.config.icons.toggleOn.fontString : this.props.config.icons.toggleOff.fontString;
    var switchStyle = this.props.switchOn ? [styles.buttonText, {fontFamily: this.props.config.icons.toggleOn.fontFamilyName}] : [styles.buttonText, {fontFamily: this.props.config.icons.toggleOff.fontFamilyName}];

    return (
      <TouchableHighlight
        onPress={this.onSwitchToggled}>
        <View style={styles.container}>
          <Text style={offTextStyle}>{this.props.switchOffText}</Text>
          <Text style={switchStyle}>{switchIcon}</Text>
          <Text style={onTextStyle}>{this.props.switchOnText}</Text>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = ToggleSwitch;