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
  UI_TEXT,
} = Constants;

var styles = require('../utils').getStyles(require('./style/ToggleSwitchStyles.json'));

var ToggleSwitch = React.createClass({
  propTypes: {
    switchOn: React.PropTypes.bool,
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
          <Text style={offTextStyle}>{UI_TEXT.OFF}</Text>
          <Text style={styles.buttonText}>{switchIcon}</Text>
          <Text style={onTextStyle}>{UI_TEXT.ON}</Text>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = ToggleSwitch;