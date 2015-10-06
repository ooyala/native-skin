/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  SwitchIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Constants = require('../constants');

var styles = require('../utils').getStyles(require('./style/ToggleSwitchStyles.json'));

var ToggleSwitch = React.createClass({
  propTypes: {
    switchOn: React.PropTypes.bool,
    areClosedCaptionsAvailable: React.PropTypes.bool,
    switchOnText: React.PropTypes.string,
    switchOffText: React.PropTypes.string,
    onValueChanged: React.PropTypes.func,
    config: React.PropTypes.object
  },

  onSwitchToggled: function() {
    this.props.onValueChanged(!this.props.switchOn);
  },

  render: function() {
    var onTextStyle = this.props.switchOn ? styles.highlightedText : styles.grayedText;
    var offTextStyle = this.props.switchOn ? styles.grayedText : styles.highlightedText;
    return (
        <View style={styles.container}>
          <Text style={offTextStyle}>{this.props.switchOffText}</Text>
            <SwitchIOS value={this.props.switchOn} onValueChange={this.onSwitchToggled} disabled={!this.props.areClosedCaptionsAvailable} />
          <Text style={onTextStyle}>{this.props.switchOnText}</Text>
        </View>
    );
  },
});

module.exports = ToggleSwitch;