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
  },

  getInitialState: function() {
    return {switchOn:this.props.switchOn};
  },

  onSwitchToggled: function() {
    var nextState = !this.state.switchOn;
    this.setState({switchOn: nextState});
    this.props.onValueChanged(nextState);
  },

  render: function() {
    var onTextStyle = this.state.switchOn ? styles.highlightedText : styles.grayedText;
    var offTextStyle = this.state.switchOn ? styles.grayedText : styles.highlightedText;
    var switchIcon = this.state.switchOn ? ICONS.TOGGLEON : ICONS.TOGGLEOFF; TOGGLEOFF: 

    return (
      <TouchableHighlight
        onPress={this.onSwitchToggled}>
        <View style={styles.container}>
          <Text style={offTextStyle}>{this.props.switchOffText}</Text>
          <Text style={styles.buttonText}>{switchIcon}</Text>
          <Text style={onTextStyle}>{this.props.switchOnText}</Text>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = ToggleSwitch;