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
  View
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/adBarStyles.json'));
var Constants = require('./constants');
var {
  BUTTON_NAMES
} = Constants;

var Utils = require('./utils');

var AdBar = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    count: React.PropTypes.number,
    index: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showButton: React.PropTypes.bool,
    buttonText: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0, title:'', count: 1, index: 0};
  },

  onButton: function() { 
    this.props.onPress(BUTTON_NAMES.LEARNMORE);
  }, 

  render: function() {
    var remainingString = 
      Utils.secondsToString(this.props.duration - this.props.playhead);

    var countString = "(" + this.props.index + "/" + this.props.count + ")";

    var rightButton;
    if (this.props.showButton) {
      rightButton = (
        <TouchableHighlight 
          onPress={this.onLearnMore}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.props.buttonText}</Text>
          </View>
        </TouchableHighlight>);
    }
    return (
      <View style={styles.container}>
          <Text style={styles.label}>{this.props.title + countString + ' | ' + remainingString}</Text>
          <View style={styles.placeholder} />
          {rightButton}
      </View>
      );
  }
});

module.exports = AdBar;
